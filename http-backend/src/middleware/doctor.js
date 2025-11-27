const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function doctorMiddleware(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("❌ Authorization header missing or invalid");
        return res.status(403).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.DOCTOR_JWT_SECRET) {
        console.error("❌ DOCTOR_JWT_SECRET environment variable is not set!");
        return res.status(500).json({ message: "Server configuration error" });
    }

    try {
        const decoded = jwt.verify(token, process.env.DOCTOR_JWT_SECRET);
        console.log("Token decoded successfully:", decoded);

        if (!decoded.id) {
            console.error("❌ Token missing 'id' field. Token payload:", decoded);
            return res.status(403).json({ message: "Invalid token structure" });
        }

        // Validate that the ID is a valid MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            console.error("❌ Invalid ObjectId format in token:", decoded.id);
            return res.status(403).json({ message: "Invalid doctor ID in token" });
        }

        console.log("✅ Doctor ID from token:", decoded.id);
        req.doctorId = decoded.id;
        console.log("✅ req.doctorId set to:", req.doctorId);
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);
        console.error("Error name:", error.name);
        
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expired. Please log in again." });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token. Please log in again." });
        }
        
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = { doctorMiddleware };
