// InfluencerDashboard.tsx
import React, { useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import ProfileSettings from "./ProfileSettings";
import CollaborationManagement from "./CollaborationManagement";
import PaymentManagement from "./PaymentManagement";
import MessagingSystem from "./MessagingSystem";
import AccountSettings from "./AccountSettings";

const InfluencerDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Dashboard Header */}
      <div className="flex justify-between items-center p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Influencer Dashboard</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-6 space-y-6">
        {/* Profile Settings */}
        <ProfileSettings />

        {/* Collaboration Management */}
        <CollaborationManagement />

        {/* Payment Management */}
        <PaymentManagement />

        {/* Messaging System */}
        <MessagingSystem />

        {/* Account Settings */}
        <AccountSettings />
      </div>
    </div>
  );
};

export default InfluencerDashboard;