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
        bio: z.string(),
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
            .populate("userId", "firstName lastName email age phoneNumber address bloodGroup")
            .populate("doctorId", "firstName lastName specialization hospital")
            .select("_id userId doctorId status authKey date time visitType medicalReason notes phone")
            .sort({ date: -1, createdAt: -1 });

        res.json({ message: "Appointments fetched successfully", appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
});

doctorRouter.get("/patients", doctorMiddleware, async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const appointments = await AppointmentModel.find({ doctorId })
            .populate("userId", "firstName lastName email age address phoneNumber bloodGroup")
            .sort({ date: -1, createdAt: -1 });

        // Get unique patients (remove duplicates by userId)
        const patientMap = new Map();
        appointments.forEach(appointment => {
            if (appointment.userId && !patientMap.has(appointment.userId._id.toString())) {
                patientMap.set(appointment.userId._id.toString(), {
                    ...appointment.userId.toObject(),
                    lastAppointment: appointment.date,
                    appointmentStatus: appointment.status,
                    appointmentId: appointment._id
                });
            }
        });

        const patients = Array.from(patientMap.values());
        res.json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

doctorRouter.post("/update", doctorMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        
        // Validate status
        const validStatuses = ["pending", "accepted", "rejected", "cancelled", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be one of: " + validStatuses.join(", ") });
        }

        // Verify the appointment belongs to this doctor
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Check if appointment belongs to the logged-in doctor
        if (appointment.doctorId.toString() !== req.doctorId.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this appointment" });
        }

        // Update appointment status
        appointment.status = status;
        if (status === "accepted" && !appointment.authKey) {
            appointment.authKey = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        await appointment.save();

        res.json({ 
            message: `Appointment ${status} successfully`, 
            authKey: appointment.authKey || null 
        });
    } catch (error) {
        console.error("Error updating appointment:", error);
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
        const doctors = await DoctorModel.find().select({
            firstName: 1,
            lastName: 1,
            _id: 1,
            bio: 1,
            specialization: 1,
            experience: 1,
            hospital: 1,
            profileImage: 1,
            email: 1,
            password: 0 // Explicitly exclude password
        }).lean();
        
        console.log("Fetched doctors from /doctor endpoint:", doctors.length);
        
        // Ensure _id is a string for consistency
        const formattedDoctors = doctors.map(doctor => ({
            ...doctor,
            _id: doctor._id.toString()
        }));
        
        res.json(formattedDoctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Error fetching doctors", error: error.message });
    }
});

doctorRouter.get("/doctor-availability", async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        
        if (!doctorId || !date) {
            return res.status(400).json({ message: "Doctor ID and date are required" });
        }
        
        // Check if the doctor exists
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        // Prepare the date to check for existing appointments
        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Get existing appointments for this doctor on this date
        // Compare dates properly by checking if appointment date falls within the selected day
        const existingAppointments = await AppointmentModel.find({
            doctorId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).select('time');
        
        // Extract the times that are already booked
        const bookedTimes = existingAppointments.map(appt => appt.time).filter(t => t);
        
        // Generate available time slots from 9 AM to 5 PM
        const availableTimeSlots = [];
        const dayOfWeek = selectedDate.getDay();
        
        // Don't schedule on weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            // Create slots every 30 minutes from 9 AM to 5 PM
            for (let hour = 9; hour < 17; hour++) {
                // Format time properly
                let hour12 = hour;
                let ampm = 'AM';
                if (hour >= 12) {
                    ampm = 'PM';
                    if (hour > 12) hour12 = hour - 12;
                }
                
                const morningTime = `${hour12}:00 ${ampm}`;
                const afternoonTime = `${hour12}:30 ${ampm}`;
                
                // Only add times that haven't been booked
                if (!bookedTimes.includes(morningTime) && !bookedTimes.some(bt => bt.includes(`${hour12}:00`))) {
                    availableTimeSlots.push(morningTime);
                }
                
                if (!bookedTimes.includes(afternoonTime) && !bookedTimes.some(bt => bt.includes(`${hour12}:30`))) {
                    availableTimeSlots.push(afternoonTime);
                }
            }
        }
        
        if (availableTimeSlots.length > 0) {
            return res.json({
                available: true,
                availableTimeSlots,
                doctor: `${doctor.firstName} ${doctor.lastName}`,
                specialization: doctor.specialization
            });
        } else {
            return res.json({
                available: false,
                message: dayOfWeek === 0 || dayOfWeek === 6 
                    ? "No appointments available on weekends. Please select a weekday."
                    : "No available time slots for the selected date."
            });
        }
        
    } catch (error) {
        console.error("Error fetching doctor availability:", error);
        res.status(500).json({ 
            message: "Error fetching available time slots", 
            error: error.message 
        });
    }
});

module.exports = doctorRouter;
