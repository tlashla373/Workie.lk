const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 🔹 File Upload Route
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully!",
    filePath: `/uploads/${req.file.filename}`
  });
});

// 🔹 Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Media routes are working!' });
});

module.exports = router;
