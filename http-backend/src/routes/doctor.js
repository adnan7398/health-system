const express = require("express");
const { UserModel, DoctorModel, AppointmentModel } = require("../models/userschema");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { doctorMiddleware } = require("../middleware/doctor");
require("dotenv").config();

const doctorRouter = express.Router();

doctorRouter.post("/doctor/signup", async function (req, res) {
    const requirebody = z.object({
        email: z.string().min(3).max(50).email(),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(2).max(20),
        bio: z.string().min(10),
        experience: z.string(),
        hospital: z.string().min(2).max(100),
        specialization: z.string().min(2).max(100),
        password: z.string().min(8).max(20).refine((password) => {
            const uppercase = /[A-Z]/.test(password);
            const lowercase = /[a-z]/.test(password);
            const specialchar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            return uppercase && lowercase && specialchar;
        }, {
            message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character."
        })
    });

    const parsedata = requirebody.safeParse(req.body);
    if (!parsedata.success) {
        return res.status(400).json({ message: "Incorrect details", error: parsedata.error });
    }

    try {
        const hashpassword = await bcrypt.hash(req.body.password, 5);
        await DoctorModel.create({
            email: req.body.email,
            password: hashpassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            bio: req.body.bio,
            experience: req.body.experience,
            hospital: req.body.hospital,
            specialization: req.body.specialization,
            profileImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        res.json({ message: "You are successfully signed up" });
    } catch (e) {
        res.status(403).json({ error: e.message });
    }
});

doctorRouter.post("/doctor/signin", async function (req, res) {
    const { email, password } = req.body;
    const doctor = await DoctorModel.findOne({ email });

    if (!doctor) {
        return res.status(403).json({ message: "User does not exist" });
    }

    try {
        const comparepassword = await bcrypt.compare(password, doctor.password);
        if (comparepassword) {
            const token = jwt.sign({ id: doctor._id.toString() }, process.env.DOCTOR_JWT_SECRET);
            return res.json({
                message: "You successfully logged in",
                token,
                doctorId: doctor._id.toString(),
            });
        }
        res.status(403).json({ message: "Wrong username or password" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

doctorRouter.get("/doctor/appointments", doctorMiddleware, async (req, res) => {
    try {
        const appointments = await AppointmentModel.find({ doctorId: req.doctorId })
            .populate("userId", "firstName lastName email age phoneNumber address")
            .select("_id userId patientPhone status authKey date");

        res.json({ message: "Appointments fetched successfully", appointments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
});

doctorRouter.get("/patients", doctorMiddleware, async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const appointments = await AppointmentModel.find({ doctorId })
            .populate("userId", "firstName lastName email age address phoneNumber bloodGroup");

        const patients = appointments.map(appointment => appointment.userId);
        res.json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ message: "Server error" });
    }
});

doctorRouter.post("/update", doctorMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (status === "accepted") {
            appointment.authKey = Math.random().toString(36).substring(2, 8);
            await appointment.save();
        }

        res.json({ message: `Appointment ${status}`, authKey: appointment.authKey });
    } catch (error) {
        res.status(500).json({ message: "Error updating appointment", error: error.message });
    }
});

doctorRouter.get("/doctor/doctors", doctorMiddleware, async (req, res) => {
    try {
        const doctor = await DoctorModel.findById(req.doctorId).select("-password");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.json({ message: "Doctor details fetched successfully", doctor });
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctor details", error: error.message });
    }
});

doctorRouter.get("/doctor", async (req, res) => {
    try {
        const doctors = await DoctorModel.find().select("-password"); // Exclude password for security
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctors", error: error.message });
    }
});


module.exports = doctorRouter;
