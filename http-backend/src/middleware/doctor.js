const jwt = require("jsonwebtoken");

function doctorMiddleware(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.DOCTOR_JWT_SECRET);

        if (!decoded.id) {
            return res.status(403).json({ message: "Invalid token structure" });
        }

        console.log("Doctor ID from token:", decoded.id);
        req.doctorId= decoded.id,
        console.log("req.doctorId:" ,req.doctorId);
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = { doctorMiddleware };
