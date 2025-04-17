const express = require("express");
const {AppointmentModel} = require("../models/userschema");
const router = express.Router();
const { io } = require("../socket");

router.post("/book", async (req, res) => {
  try {
    const { userId, doctorId } = req.body;
    const appointment = new AppointmentModel({ userId, doctorId });
    await AppointmentModel.save();
    io.to(doctorId.toString()).emit("appointmentRequest", { userId });

    res.status(201).json({ message: "Appointment request sent" });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error });
  }
});

router.post("/update-status", async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId, { status }, { new: true });

    if (status === "accepted") {
      appointment.authKey = Math.random().toString(36).substring(2, 8);
      await appointment.save();
    }

    res.json({ message: `Appointment ${status}`, authKey: appointment.authKey });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
});

module.exports = router;
