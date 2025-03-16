const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

// File type validation
const fileFilter = (req, file, cb) => {
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."), false); // Reject the file
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, "uploads/profiles/"); // Store profile pictures in a separate folder
    } else {
      cb(null, "uploads/"); // For other uploads
    }
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using UUID
    cb(null, uuidv4() + path.extname(file.originalname)); // Save with UUID and extension
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

module.exports = upload;
