const express = require("express");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const router = express.Router();
const EncryptedFile = require("../models/file");
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

// 🔐 Encrypt File
function encryptFile(filePath, password) {
    return new Promise((resolve, reject) => {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = crypto.createHash("sha256").update(password).digest();
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        const input = fs.createReadStream(filePath);
        const output = fs.createWriteStream(filePath + ".enc");
        
        output.write(iv);
        input.pipe(cipher).pipe(output);

        output.on("finish", () => {
            fs.unlinkSync(filePath); 
            resolve(path.basename(filePath + ".enc"));
        });
        output.on("error", reject);
    });
}
function decryptFile(filePath, password) {
    return new Promise((resolve, reject) => {
        const key = crypto.createHash("sha256").update(password).digest();
        const outputFilePath = filePath.replace(".enc", ".pdf");

        fs.readFile(filePath, (err, encryptedData) => {
            if (err) return reject(err);
            const iv = encryptedData.slice(0, IV_LENGTH);
            const encryptedContent = encryptedData.slice(IV_LENGTH); 

            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            let decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);

            fs.writeFile(outputFilePath, decrypted, (err) => {
                if (err) return reject(err);
                resolve(outputFilePath);
            });
        });
    });
}
router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file || !req.body.password) {
        return res.status(400).json({ message: "File and password required" });
    }

    try {
        const encryptedFile = await encryptFile(req.file.path, req.body.password);
        // Persist metadata so it survives restarts
        const record = await EncryptedFile.create({
            storedName: encryptedFile,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            ownerId: req.userId || undefined,
        });
        res.json({ message: "File uploaded & encrypted successfully!", file: encryptedFile, id: record._id });
    } catch (error) {
        res.status(500).json({ message: "Encryption failed!", error: error.message });
    }
});

router.post("/download", async (req, res) => {
    const { fileName, password } = req.body;
    const filePath = path.join(UPLOAD_DIR, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found!" });
    }

    try {
        const decryptedFilePath = await decryptFile(filePath, password);
        res.download(decryptedFilePath, (err) => {
            if (!err) fs.unlinkSync(decryptedFilePath);
        });
    } catch (error) {
        res.status(500).json({ message: "Decryption failed! Check your password.", error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const files = await EncryptedFile.find({}).sort({ createdAt: -1 }).lean();
        res.json({ files });
    } catch (e) {
        // fallback to filesystem listing if db unavailable
        const files = fs.readdirSync(UPLOAD_DIR).filter(file => file.endsWith(".enc"));
        res.json({ files: files.map(f => ({ storedName: f })) });
    }
});

module.exports = router;
