const mongoose = require("mongoose");

const PAYMENT_METHODS = ["PayPal", "Stripe", "Bank Transfer", "Crypto", "JazzCash", "Easypaisa"];
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"];

const paymentSchema = new mongoose.Schema(
  {
    payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Business
    payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Influencer
    collaboration: { type: mongoose.Schema.Types.ObjectId, ref: "Collaboration", required: true },
    amount: { type: Number, required: true, min: 0 }, // Ensuring amount is positive
    currency: { type: String, default: "USD" },
    paymentMethod: { 
      type: String, 
      enum: PAYMENT_METHODS, 
      required: true 
    },
    transactionId: { type: String, unique: true, required: true },
    status: { type: String, enum: PAYMENT_STATUSES, default: "pending" },
    refundId: { type: String },
    refundedAt: { type: Date },
    notes: { type: String },
    paymentDate: { type: Date },
    paymentReceipt: { type: String }
  },
  { timestamps: true }
);

// Automatically set refund timestamp when status changes to "refunded"
paymentSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "refunded") {
    this.refundedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
