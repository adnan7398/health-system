require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const fileRoutes = require("./src/routes/fileRoute");
const authRoutes = require("./src/routes/user");
const doctorRoutes = require("./src/routes/doctor");

const app = express();

// serve uploads
app.use("/uploads", express.static("uploads"));

// CORS — allow both Vite ports
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://arogyam.vercel.app"
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// your routes
app.use("/", authRoutes);
app.use("/", doctorRoutes);
app.use("/files", fileRoutes);

const PORT = process.env.PORT || 3000;
console.log(`MongoDB URL : ${process.env.MONGO_URL}`);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));