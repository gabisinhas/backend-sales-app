import express from "express";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";

import { publishImportSales } from "../infra/rabbit/publishImportSales.js";

const app = express();
const upload = multer({ dest: "uploads/" });

function calculateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileHash = calculateFileHash(file.path);

    const payload = {
      filePath: file.path,
      fileHash,
      originalName: file.originalname,
      uploadedAt: new Date().toISOString()
    };

    await publishImportSales(payload);

    return res.status(202).json({
      message: "File uploaded and queued for processing",
      payload
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Failed to upload file"
    });
  }
});

app.listen(3000, () => {
  console.log("Upload API running on port 3000");
});
