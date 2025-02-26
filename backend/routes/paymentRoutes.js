const express = require("express");
const router = express.Router();

// Import controller functions for payments
const { createPayment, getPayments, updatePaymentStatus } = require("../controllers/paymentController");

// Route to create a payment
router.post("/", createPayment);

// Route to get all payments (can add filtering as needed)
router.get("/", getPayments);

// Route to update payment status (e.g., completed, failed, refunded)
router.put("/:id/status", updatePaymentStatus);

module.exports = router;
