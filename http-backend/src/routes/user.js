const express = require("express");
const { UserModel, DoctorModel, AppointmentModel } = require("../models/userschema");
const bcrypt = require("bcryptjs");
const userRouter = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { userMiddleware } = require("../middleware/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const upload = require("../middleware/upload");
require("dotenv").config();
const QRCode = require("qrcode");
userRouter.post("/signup", async function (req, res) {
    const requirebody = z.object({
        email: z.string().min(3).max(50).email(),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(2).max(20),
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
        res.json({
            message: "incorrect detail",
            error: parsedata.error
        })
        return
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    let errorthrown = false;
    try {
        const hashpassword = await bcrypt.hash(password, 5);
        //const profileImage = req.file ? /uploads/${ req.file.filename }: null;
        await UserModel.create({
            email: email,
            password: hashpassword,
            firstName: firstName,
            lastName: lastName,
        })
    } catch (e) {
        res.status(403).json({
            error: e.message
        })
        errorthrown = true
    }
    if (!errorthrown) {
        res.json({
            message: "You Are successfuly signed up"
        })
    }
});
userRouter.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const response = await UserModel.findOne({
        email: email
    })
    if (!response) {
        res.status(403).json({
            message: "User does not exist"
        })
        return
    }
    try {
        const comparepassword = await bcrypt.compare(password, response.password);
        if (comparepassword) {
            const token = jwt.sign({
                id: response._id.toString()
            }, process.env.JWT_SECRET);
            res.json({
                message: "You successfully logged in",
                token: token,
                userId: response._id.toString()
            });
        } else {
            res.status(403).json({
                message: "Wrong username or password"
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Wrong username or password:",
            error: error.message
        })
    }
})
userRouter.post("/register", userMiddleware, async function (req, res) {
    const userSchemaValidation = z.object({

        firstName: z.string().max(100),
        lastName: z.string().max(20),
        bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
        age: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
    });
    const parsedData = userSchemaValidation.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect details",
            error: parsedData.error
        });
        return;
    }
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const bloodGroup = req.body.bloodGroup;
    const age = req.body.age;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    try {
        const user = await UserModel.findByIdAndUpdate(req.userId, {
            firstName,
            lastName,
            bloodGroup,
            age,
            phoneNumber,
            address,
        }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const qrData = JSON.stringify({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            bloodGroup,
            age,
            phoneNumber,
            address,
        });
        const qrCodeUrl = `http://localhost:3000/details/${user._id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
        user.qrCode = qrCodeDataUrl;
        await user.save();


        res.status(200).json({
            message: "Medical details updated and QR code generated",
            //qrCode: <img src="${qrCodeDataUrl}" alt="QR Code" />,
            userId: req.userId
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating medical details", error: error.message });
    }
});
userRouter.get("/details/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ userId: user._id, email: user.email, firstName: user.firstName ,age: user.age, lastName: user.lastName, bloodGroup: user.bloodGroup, phoneNumber: user.phoneNumber, address: user.address})
    } catch (error) {
        res.status(500).json({ message: "Error fetching QR details", error: error.message });
    }
});
userRouter.post("/auth", async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Access granted", token, redirectUrl: `/dashboard` });

    } catch (error) {
        res.status(500).json({ message: "Authentication failed", error: error.message });
    }
});



userRouter.get("/register/:id", userMiddleware, async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            bloodGroup: user.bloodGroup,
            age: user.age,
            phoneNumber: user.phoneNumber,
            address: user.address,
            qrCode: user.qrCode
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});



userRouter.post("/book-appointment", userMiddleware, async (req, res) => {
    const doctorId = req.body.doctorId;

    try {
        const user = await UserModel.findById(req.userId);
        const doctor = await DoctorModel.findById(doctorId);

        if (!user || !doctor) {
            return res.status(404).json({ message: "User or Doctor not found" });
        }
        const currentDate = new Date();
        const authKey = Math.random().toString(36).substring(2, 8);
        const appointment = new AppointmentModel({
            userId: user._id,
            doctorId,
            status: "pending",
            authKey,
            date: currentDate,
        });

        await appointment.save();
        await DoctorModel.findByIdAndUpdate(doctorId, {
            $push: { appointments: appointment._id }
        });

        res.json({
            message: "Appointment booked successfully",
            appointment,
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

userRouter.get("/appointments", userMiddleware, async (req, res) => {
    try {
        const appointments = await AppointmentModel.find({ userId: req.userId })
            .populate("doctorId", "firstName lastName specialization")
            .populate("userId", "firstName lastName email").lean();
        console.log("Fetched Appointments:", JSON.stringify(appointments, null, 2));
        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
});
userRouter.get("/doctors", async (req, res) => {
    try {
        const doctors = await DoctorModel.find({}, { firstName: 1, lastName: 1, _id: 1, bio: 1, specialization: 1, experience: 1 }); // Explicitly select fields
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


userRouter.post("/update-status", async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Simple chatbot endpoint
userRouter.post("/chatbot", async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Simple response logic - in a real app, you'd integrate with OpenAI or similar
        let response = "I'm here to help with your health questions. Please provide more details about your concern.";
        
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes("headache") || lowerMessage.includes("head pain")) {
            response = "Headaches can have various causes including stress, dehydration, lack of sleep, or underlying medical conditions. I recommend staying hydrated, getting adequate rest, and consulting a doctor if the pain is severe or persistent.";
        } else if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
            response = "A fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and monitor your temperature. Seek medical attention if fever is above 103°F (39.4°C) or persists for more than 3 days.";
        } else if (lowerMessage.includes("cough") || lowerMessage.includes("cold")) {
            response = "For coughs and colds, rest, stay hydrated, and consider over-the-counter remedies. If symptoms persist for more than 10 days or become severe, consult a healthcare provider.";
        } else if (lowerMessage.includes("appointment") || lowerMessage.includes("book")) {
            response = "To book an appointment, please use our appointment booking system. You can select a doctor, choose a date and time, and provide your medical details.";
        } else if (lowerMessage.includes("doctor") || lowerMessage.includes("physician")) {
            response = "We have qualified doctors across various specialties including cardiology, neurology, pediatrics, and more. You can browse our doctor directory to find the right specialist for your needs.";
        }

        res.json({ 
            message: response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Aadhaar registration route
userRouter.post("/register-aadhaar", userMiddleware, async (req, res) => {
    try {
        const { aadhaarNumber, firstName, lastName, age, phoneNumber, address, bloodGroup } = req.body;
        
        // Validate Aadhaar number format
        if (!/^\d{12}$/.test(aadhaarNumber)) {
            return res.status(400).json({ message: "Invalid Aadhaar number format" });
        }

        // Check if Aadhaar number is already registered
        const existingUser = await UserModel.findOne({ aadhaarNumber });
        if (existingUser && existingUser._id.toString() !== req.userId) {
            return res.status(400).json({ message: "Aadhaar number already registered with another account" });
        }

        // Update user with Aadhaar and health card data
        const user = await UserModel.findByIdAndUpdate(req.userId, {
            aadhaarNumber,
            firstName,
            lastName,
            age,
            phoneNumber,
            address,
            bloodGroup,
            isHealthCardRegistered: true,
            'healthCardData.registrationDate': new Date(),
            'healthCardData.lastUpdated': new Date()
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate QR code for health card
        const qrData = JSON.stringify({
            id: user._id,
            aadhaarNumber: user.aadhaarNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            bloodGroup: user.bloodGroup,
            age: user.age,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isHealthCardRegistered: user.isHealthCardRegistered
        });

        const qrCodeUrl = `http://localhost:3000/details/${user._id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
        user.qrCode = qrCodeDataUrl;
        await user.save();

        res.status(200).json({
            message: "Health card registered successfully with Aadhaar",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                aadhaarNumber: user.aadhaarNumber,
                isHealthCardRegistered: user.isHealthCardRegistered,
                qrCode: user.qrCode
            }
        });

    } catch (error) {
        console.error("Aadhaar registration error:", error);
        res.status(500).json({ message: "Error registering health card", error: error.message });
    }
});

// Check health card registration status
userRouter.get("/health-card-status", userMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            isHealthCardRegistered: user.isHealthCardRegistered || false,
            aadhaarNumber: user.aadhaarNumber || null,
            healthCardData: user.healthCardData || {},
            qrCode: user.qrCode || null,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bloodGroup: user.bloodGroup,
                age: user.age,
                phoneNumber: user.phoneNumber,
                address: user.address
            }
        });

    } catch (error) {
        console.error("Health card status check error:", error);
        res.status(500).json({ message: "Error checking health card status", error: error.message });
    }
});

// Update health card data
userRouter.put("/update-health-card", userMiddleware, async (req, res) => {
    try {
        const { bloodGroup, age, phoneNumber, address, emergencyContact } = req.body;
        
        const updateData = {
            bloodGroup,
            age,
            phoneNumber,
            address,
            'healthCardData.lastUpdated': new Date()
        };

        if (emergencyContact) {
            updateData['healthCardData.emergencyContact'] = emergencyContact;
        }

        const user = await UserModel.findByIdAndUpdate(req.userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Regenerate QR code with updated data
        const qrData = JSON.stringify({
            id: user._id,
            aadhaarNumber: user.aadhaarNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            bloodGroup: user.bloodGroup,
            age: user.age,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isHealthCardRegistered: user.isHealthCardRegistered
        });

        const qrCodeUrl = `http://localhost:3000/details/${user._id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
        user.qrCode = qrCodeDataUrl;
        await user.save();

        res.status(200).json({
            message: "Health card updated successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                isHealthCardRegistered: user.isHealthCardRegistered,
                qrCode: user.qrCode
            }
        });

    } catch (error) {
        console.error("Health card update error:", error);
        res.status(500).json({ message: "Error updating health card", error: error.message });
    }
});

module.exports = userRouter;








// const session = require("express-session");
// app.use(session({
//     secret:'keyboard cat',
//     resave:false,
//     saveUninitialized:true
// }))
// console.log(process.env.GOOGLE_CLIENT_ID);
// app.use(passport.initialize());
// const googlestrategy = require("passport-google-oauth20").OAuth2Strategy;
// passport.use(new googlestrategy({
//     clientID:process.env.GOOGLE_CLIENT_ID,
//     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:"http://localhost:3000/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done)=>{
//     try{
//         let user = await userModel.findOne({email:profile.emails[0].value});
//         if(!user){
//             user = new userModel({
//                 name:profile.displayName,
//                 email:profile.emails[0].value,
//                 googleId:profile.id
//             });
//             await user.save();
//         }
//         return done(null,user);
//     }catch(e){
//         return done(e,null);
//     }
// }));