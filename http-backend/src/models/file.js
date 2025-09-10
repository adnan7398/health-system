const mongoose = require("mongoose");

const encryptedFileSchema = new mongoose.Schema(
  {
    storedName: { type: String, required: true }, // e.g. 1745167340345.pdf.enc
    originalName: { type: String, required: true }, // e.g. report.pdf
    mimeType: { type: String },
    size: { type: Number },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EncryptedFile", encryptedFileSchema);


