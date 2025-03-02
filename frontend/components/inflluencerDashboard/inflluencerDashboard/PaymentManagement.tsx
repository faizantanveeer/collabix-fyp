import React, { useState, useEffect } from "react";
import { CreditCardIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Payment {
  id: number;
  amount: number;
  status: string;
  date: string;
}

interface PaymentMethod {
  id?: number;
  type: "jazzcash" | "sadapay" | "bank";
  details: string;
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null);

  // Fetch payment history and payment methods from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentsResponse = await axios.get<Payment[]>("/api/payments");
        const methodsResponse = await axios.get<PaymentMethod[]>("/api/payment-methods");
        setPayments(paymentsResponse.data);
        setPaymentMethods(methodsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle input changes for payment method form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentMethod((prev) => ({ ...prev, [name]: value } as PaymentMethod));
  };

  // Save payment method
  const handleSavePaymentMethod = async () => {
    if (!currentMethod || !currentMethod.details) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Validate payment method details
    if (currentMethod.type === "jazzcash" && currentMethod.details.length !== 12) {
      toast.error("JazzCash ID must be 12 digits.");
      return;
    }
    if (currentMethod.type === "sadapay" && currentMethod.details.length !== 12) {
      toast.error("Sadapay ID must be 12 digits.");
      return;
    }
    if (currentMethod.type === "bank" && currentMethod.details.length !== 14) {
      toast.error("Bank account number must be 14 digits.");
      return;
    }

    try {
      if (currentMethod.id) {
        // Update existing payment method
        await axios.put(`/api/payment-methods/${currentMethod.id}`, currentMethod);
        toast.success("Payment method updated successfully!");
      } else {
        // Add new payment method
        await axios.post("/api/payment-methods", currentMethod);
        toast.success("Payment method added successfully!");
      }
      // Refresh payment methods
      const response = await axios.get<PaymentMethod[]>("/api/payment-methods");
      setPaymentMethods(response.data);
      setIsEditing(false);
      setCurrentMethod(null);
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast.error("Failed to save payment method.");
    }
  };

  // Open payment method form
  const openPaymentMethodForm = (method?: PaymentMethod) => {
    setCurrentMethod(method || { type: "jazzcash", details: "" });
    setIsEditing(true);
  };

  // Close payment method form
  const closePaymentMethodForm = () => {
    setIsEditing(false);
    setCurrentMethod(null);
  };

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <CreditCardIcon className="h-6 w-6 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Payment Management
        </h3>
      </div>
      <div className="mt-3 space-y-4">
        {/* Payment History */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Payment History
          </h4>
          <ul className="space-y-2">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span>
                  ${payment.amount.toLocaleString()} - {payment.status} ({payment.date})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Payment Methods
          </h4>
          <ul className="space-y-2">
            {paymentMethods.map((method) => (
              <li
                key={method.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span>
                  {method.type === "jazzcash" && "JazzCash: "}
                  {method.type === "sadapay" && "Sadapay: "}
                  {method.type === "bank" && "Bank Account: "}
                  {method.details}
                </span>
                <button
                  onClick={() => openPaymentMethodForm(method)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => openPaymentMethodForm()}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Payment Method
          </button>
        </div>

        {/* Payment Method Form */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentMethod?.id ? "Update Payment Method" : "Add Payment Method"}
              </h3>
              <div className="mt-4 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method
                  </label>
                  <select
                    name="type"
                    value={currentMethod?.type || "jazzcash"}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="jazzcash">JazzCash</option>
                    <option value="sadapay">Sadapay</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Details
                  </label>
                  <input
                    type="text"
                    name="details"
                    value={currentMethod?.details || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder={
                      currentMethod?.type === "jazzcash"
                        ? "Enter 12-digit JazzCash ID"
                        : currentMethod?.type === "sadapay"
                        ? "Enter 12-digit Sadapay ID"
                        : "Enter 14-digit Bank Account Number"
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleSavePaymentMethod}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={closePaymentMethodForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;