const mongoose = require('mongoose');
const { string, date } = require('zod');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 100 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    address: { type: String },
    age: { type: Number},
    phoneNumber: { type: Number},
    profileImage: { type: String }, 
    qrCode: { type: String },
}, { timestamps: true });


const DoctorSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 100 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 20 },
    specialization:{type:  String},
    email: {type : String, required: true, unique: true},
    password:{type:String,required:true}, 
    bio: {type:String},
    experience: {type:String,},
    hospital: {type: String}, 
    appointments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        qrCode: String,
        authKey: String,
      },
    ],
  });
  
const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  authKey: String,
  date: { type: Date, required: true },
});


const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
const UserModel = mongoose.model("User", UserSchema);
const DoctorModel = mongoose.model("Doctor", DoctorSchema);


module.exports = { UserModel,DoctorModel,AppointmentModel};
