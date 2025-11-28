const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const predictRouter = require("./routes/predict");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// health
app.get("/", (req, res) => res.json({ ok: true, message: "ML backend running" }));

// ML routes
app.use("/ml", predictRouter);

// fallback
app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`ML backend listening on http://localhost:${PORT}`);
});
