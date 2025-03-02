"use client";
import { useState } from "react";

interface Message {
  text: string;
  sender: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "You" }]);
    setInput("");
  };

  return (
    <div className="w-full h-[500px] flex flex-col border rounded-lg shadow-lg bg-white overflow-hidden">
      
      {/* Header */}
      <div className=" bg-gray-900 text-white py-3 px-5 text-lg font-semibold">
        Chat Window
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm shadow-md ${
              msg.sender === "You"
                ? " bg-gray-900 text-white self-end"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-gray-100 flex items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="ml-3  bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
``