const express = require("express");
const { UserModel, DoctorModel, AppointmentModel } = require("../models/userschema");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { doctorMiddleware } = require("../middleware/doctor");
const upload = require("../middleware/upload");
require("dotenv").config();

const doctorRouter = express.Router();

doctorRouter.post("/doctor/signup", upload.single("profileImage"), async function (req, res) {
    console.log("=== Doctor Signup Request ===");
    console.log("Request body:", {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        specialization: req.body.specialization,
        hospital: req.body.hospital,
        experience: req.body.experience,
        hasBio: !!req.body.bio,
        hasPassword: !!req.body.password
    });

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
        console.log("❌ Validation failed:", parsedata.error.errors);
        return res.status(400).json({ 
            message: "Incorrect details", 
            error: parsedata.error.errors,
            details: "Please check all required fields are filled correctly"
        });
    }

    try {
        // Check if doctor with this email already exists
        const existingDoctor = await DoctorModel.findOne({ email: req.body.email });
        if (existingDoctor) {
            console.log("❌ Doctor with email already exists:", req.body.email);
            return res.status(409).json({ 
                message: "Doctor with this email already exists. Please use a different email or sign in instead.",
                error: "Email already registered"
            });
        }

        console.log("Hashing password...");
        const hashpassword = await bcrypt.hash(req.body.password, 5);
        
        console.log("Creating doctor in database...");
        const newDoctor = await DoctorModel.create({
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

        console.log("✅ Doctor created successfully!");
        console.log("Doctor ID:", newDoctor._id.toString());
        console.log("Doctor Name:", `${newDoctor.firstName} ${newDoctor.lastName}`);
        console.log("Doctor Email:", newDoctor.email);

        res.json({ 
            message: "You are successfully signed up",
            doctorId: newDoctor._id.toString()
        });
    } catch (e) {
        console.error("❌ Error creating doctor:", e);
        console.error("Error name:", e.name);
        console.error("Error message:", e.message);
        
        // Handle duplicate key error (MongoDB)
        if (e.code === 11000 || e.name === 'MongoServerError') {
            return res.status(409).json({ 
                message: "Doctor with this email already exists. Please use a different email or sign in instead.",
                error: "Email already registered"
            });
        }
        
        // Handle validation errors
        if (e.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error. Please check all required fields.",
                error: e.message
            });
        }

        res.status(500).json({ 
            message: "Error creating doctor account. Please try again.",
            error: e.message 
        });
    }
});

doctorRouter.post("/doctor/signin", async function (req, res) {
    console.log("=== Doctor Signin Request ===");
    console.log("Email:", req.body.email);
    console.log("DOCTOR_JWT_SECRET exists:", !!process.env.DOCTOR_JWT_SECRET);
    console.log("DOCTOR_JWT_SECRET length:", process.env.DOCTOR_JWT_SECRET ? process.env.DOCTOR_JWT_SECRET.length : 0);
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const doctor = await DoctorModel.findOne({ email });
        console.log("Doctor found:", !!doctor);
        
        if (!doctor) {
            console.log("❌ Doctor not found with email:", email);
            return res.status(403).json({ message: "Doctor does not exist. Please sign up first." });
        }

        console.log("Doctor ID from database:", doctor._id.toString());
        console.log("Comparing password...");
        const comparepassword = await bcrypt.compare(password, doctor.password);
        
        if (comparepassword) {
            // Double-check that doctor still exists in database before creating token
            const verifiedDoctor = await DoctorModel.findById(doctor._id);
            if (!verifiedDoctor) {
                console.error("❌ Doctor was deleted after password check");
                return res.status(404).json({ message: "Doctor account no longer exists. Please contact support." });
            }

            // Check if JWT secret is set
            if (!process.env.DOCTOR_JWT_SECRET) {
                console.error("❌ DOCTOR_JWT_SECRET environment variable is not set!");
                return res.status(500).json({ 
                    message: "Server configuration error. Please contact administrator.",
                    error: "JWT_SECRET_NOT_SET"
                });
            }

            try {
            const token = jwt.sign({ id: doctor._id.toString() }, process.env.DOCTOR_JWT_SECRET);
                console.log("✅ Token created successfully");
            console.log("✅ Doctor logged in successfully!");
            console.log("Doctor ID:", doctor._id.toString());
            console.log("Doctor Name:", `${doctor.firstName} ${doctor.lastName}`);
            
            return res.json({
                message: "You successfully logged in",
                token,
                doctorId: doctor._id.toString(),
            });
            } catch (tokenError) {
                console.error("❌ Error creating token:", tokenError);
                return res.status(500).json({ 
                    message: "Error creating authentication token. Please try again.",
                    error: tokenError.message
                });
            }
        }
        
        console.log("❌ Wrong password for email:", email);
        res.status(403).json({ message: "Wrong email or password" });
    } catch (error) {
        console.error("❌ Error during signin:", error);
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
        console.log("=== Fetching Doctor Details ===");
        console.log("Doctor ID from request:", req.doctorId);
        console.log("Doctor ID type:", typeof req.doctorId);

        if (!req.doctorId) {
            console.error("❌ Doctor ID is missing from request");
            return res.status(400).json({ message: "Doctor ID is missing" });
        }

        // Convert to ObjectId if it's a string
        const mongoose = require("mongoose");
        let doctorId = req.doctorId;
        
        // If it's a string, try to convert to ObjectId
        if (typeof doctorId === 'string' && mongoose.Types.ObjectId.isValid(doctorId)) {
            doctorId = new mongoose.Types.ObjectId(doctorId);
        }

        console.log("Searching for doctor with ID:", doctorId);
        
        // Try to find doctor with the ID
        const doctor = await DoctorModel.findById(doctorId).select("-password");

        if (!doctor) {
            console.error("❌ Doctor not found in database");
            console.error("Searched ID value:", req.doctorId);
            console.error("Searched ID type:", typeof req.doctorId);
            
            // List all doctors for debugging (remove in production)
            try {
                const allDoctors = await DoctorModel.find({}).select("_id email firstName lastName").limit(5);
                console.log("Sample doctors in database:", allDoctors.map(d => ({
                    id: d._id.toString(),
                    email: d.email,
                    name: `${d.firstName} ${d.lastName}`
                })));
            } catch (err) {
                console.error("Error listing doctors:", err);
            }
            
            // Return 401 (Unauthorized) instead of 404 to trigger re-login
            return res.status(401).json({ 
                message: "Your session has expired or your account no longer exists. Please log in again.",
                code: "DOCTOR_NOT_FOUND",
                requiresLogin: true
            });
        }

        console.log("✅ Doctor found:", {
            id: doctor._id.toString(),
            name: `${doctor.firstName} ${doctor.lastName}`,
            email: doctor.email
        });

        res.json({ message: "Doctor details fetched successfully", doctor });
    } catch (error) {
        console.error("❌ Error fetching doctor details:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Error fetching doctor details", error: error.message });
    }
});

// Update doctor profile
doctorRouter.put("/doctor/profile", doctorMiddleware, upload.single("profileImage"), async (req, res) => {
    console.log("=== Doctor Profile Update Request ===");
    console.log("Doctor ID:", req.doctorId);
    console.log("Request body:", req.body);

    try {
        const { firstName, lastName, bio, specialization, experience, hospital, email } = req.body;

        // Find the doctor
        const doctor = await DoctorModel.findById(req.doctorId);
        if (!doctor) {
            console.log("❌ Doctor not found");
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Validate and update fields
        const updateData = {};
        
        if (firstName !== undefined) {
            if (firstName.length < 2 || firstName.length > 100) {
                return res.status(400).json({ message: "First name must be between 2 and 100 characters" });
            }
            updateData.firstName = firstName;
        }

        if (lastName !== undefined) {
            if (lastName.length < 2 || lastName.length > 20) {
                return res.status(400).json({ message: "Last name must be between 2 and 20 characters" });
            }
            updateData.lastName = lastName;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        if (specialization !== undefined) {
            if (specialization.length < 2 || specialization.length > 100) {
                return res.status(400).json({ message: "Specialization must be between 2 and 100 characters" });
            }
            updateData.specialization = specialization;
        }

        if (experience !== undefined) {
            updateData.experience = experience;
        }

        if (hospital !== undefined) {
            if (hospital.length < 2 || hospital.length > 100) {
                return res.status(400).json({ message: "Hospital name must be between 2 and 100 characters" });
            }
            updateData.hospital = hospital;
        }

        // Handle email update separately (check for duplicates)
        if (email !== undefined && email !== doctor.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            
            // Check if email is already taken by another doctor
            const existingDoctor = await DoctorModel.findOne({ email });
            if (existingDoctor && existingDoctor._id.toString() !== req.doctorId.toString()) {
                return res.status(409).json({ message: "Email already registered with another account" });
            }
            updateData.email = email;
        }

        // Handle profile image if uploaded
        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

        // Update the doctor
        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            req.doctorId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        console.log("✅ Doctor profile updated successfully!");
        console.log("Updated Doctor:", {
            id: updatedDoctor._id.toString(),
            name: `${updatedDoctor.firstName} ${updatedDoctor.lastName}`,
            email: updatedDoctor.email
        });

        res.json({
            message: "Doctor profile updated successfully",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("❌ Error updating doctor profile:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);

        // Handle duplicate key error (MongoDB)
        if (error.code === 11000 || error.name === 'MongoServerError') {
            return res.status(409).json({
                message: "Email already registered with another account",
                error: "Duplicate email"
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error. Please check all fields.",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error updating doctor profile. Please try again.",
            error: error.message
        });
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
            email: 1
            // Note: password is automatically excluded when using inclusion projection
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
