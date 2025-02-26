const Payment = require("../models/payment_model");

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const { payer, payee, collaboration, amount, currency, paymentMethod, transactionId } = req.body;

    if (!payer || !payee || !collaboration || !amount || !currency || !paymentMethod || !transactionId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new payment instance
    const newPayment = new Payment({
      payer,
      payee,
      collaboration,
      amount,
      currency,
      paymentMethod,
      transactionId,
    });

    // Save the payment
    await newPayment.save();

    return res.status(201).json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: "Failed to create payment" });
  }
};

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("payer payee collaboration").exec();
    return res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
};

// Update payment status (e.g., completed, failed, refunded)
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["pending", "completed", "failed", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status provided" });
    }

    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.status(200).json({ message: "Payment status updated successfully", payment });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ error: "Failed to update payment status" });
  }
};

module.exports = { createPayment, getPayments, updatePaymentStatus };
