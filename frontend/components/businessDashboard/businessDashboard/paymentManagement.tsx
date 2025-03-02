// PaymentManagement.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Payment {
  id: number;
  amount: number;
  status: string;
  date: string;
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get<Payment[]>("/api/payments");
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Payment Management
      </h3>
      <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
        <ul>
          {payments.map((payment) => (
            <li key={payment.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              ${payment.amount.toLocaleString()} - {payment.status} ({payment.date})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentManagement;