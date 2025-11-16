const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded - id:", decoded.id, "type:", typeof decoded.id);
        req.userId = decoded.id;
        console.log("req.userId set to:", req.userId, "type:", typeof req.userId);
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = { userMiddleware };
