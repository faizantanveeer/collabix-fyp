// MessagingSystem.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

const MessagingSystem = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>("/api/messages");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    try {
      const response = await axios.post<Message>("/api/messages", {
        sender: "business", // Assuming the business is the sender
        receiver: "influencer",
        content: newMessage,
      });
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Messaging System
      </h3>
      <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
        <ul>
          {messages.map((message) => (
            <li key={message.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <strong>{message.sender}:</strong> {message.content}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;