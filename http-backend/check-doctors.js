// Script to check doctors in database
require("dotenv").config();
const mongoose = require("mongoose");
const { DoctorModel } = require("./src/models/userschema");

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!MONGO_URL) {
  console.error("Error: MONGO_URL or MONGODB_URI environment variable is not set!");
  process.exit(1);
}

async function checkDoctors() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully!");

    const doctors = await DoctorModel.find({}).select({
      firstName: 1,
      lastName: 1,
      _id: 1,
      email: 1,
      specialization: 1,
      hospital: 1,
      experience: 1
    }).lean();

    console.log("\n=== DOCTORS IN DATABASE ===");
    console.log(`Total doctors found: ${doctors.length}\n`);

    if (doctors.length === 0) {
      console.log("❌ No doctors found in database!");
      console.log("\nTo add a doctor, use the doctor signup endpoint:");
      console.log("POST /doctor/signup");
      console.log("\nRequired fields:");
      console.log("- firstName");
      console.log("- lastName");
      console.log("- email");
      console.log("- password");
      console.log("- specialization");
      console.log("- hospital");
      console.log("- experience");
      console.log("- bio");
    } else {
      doctors.forEach((doctor, index) => {
        console.log(`Doctor ${index + 1}:`);
        console.log(`  ID: ${doctor._id.toString()}`);
        console.log(`  Name: ${doctor.firstName} ${doctor.lastName}`);
        console.log(`  Email: ${doctor.email}`);
        console.log(`  Specialization: ${doctor.specialization || "N/A"}`);
        console.log(`  Hospital: ${doctor.hospital || "N/A"}`);
        console.log(`  Experience: ${doctor.experience || "N/A"}`);
        console.log("");
      });
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkDoctors();


