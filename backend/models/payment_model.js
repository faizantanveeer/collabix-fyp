import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
      payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
      transactionId: { type: String, unique: true },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Payment", paymentSchema);