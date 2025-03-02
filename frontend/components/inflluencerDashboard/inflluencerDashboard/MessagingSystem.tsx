import React, { useState, useEffect } from "react";
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
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
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
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

  // Group messages by sender
  const messageThreads = messages.reduce((threads, message) => {
    const sender = message.sender;
    if (!threads[sender]) {
      threads[sender] = [];
    }
    threads[sender].push(message);
    return threads;
  }, {} as Record<string, Message[]>);

  // Send a new message or reply
  const handleSendMessage = async (sender: string) => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    try {
      const response = await axios.post<Message>("/api/messages", {
        sender: "influencer", // Assuming the influencer is the sender
        receiver: sender,
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
      <div className="flex items-center gap-2">
        <ChatBubbleLeftRightIcon className="h-6 w-6 text-pink-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Messaging System
        </h3>
      </div>
      <div className="mt-3 space-y-4">
        {/* Message Threads */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Message Threads
          </h4>
          <ul className="space-y-2">
            {Object.entries(messageThreads).map(([sender, thread]) => (
              <li
                key={sender}
                className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md cursor-pointer"
                onClick={() => setSelectedThread(sender)}
              >
                <span className="font-semibold">{sender}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {thread[thread.length - 1].content}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Thread */}
        {selectedThread && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
              Conversation with {selectedThread}
            </h4>
            <div className="mt-2 space-y-2">
              {messageThreads[selectedThread].map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded-md ${
                    message.sender === "influencer"
                      ? "bg-blue-100 dark:bg-blue-900 ml-auto w-3/4"
                      : "bg-gray-100 dark:bg-gray-700 mr-auto w-3/4"
                  }`}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={() => handleSendMessage(selectedThread)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;