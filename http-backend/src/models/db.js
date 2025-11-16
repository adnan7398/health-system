const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URI;
        if (!MONGO_URI) {
            throw new Error("MONGO_URI, MONGO_URL, or MONGODB_URI environment variable is not set!");
        }
        const connection = await mongoose.connect(MONGO_URI); 
        console.log(`MongoDB connected: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;