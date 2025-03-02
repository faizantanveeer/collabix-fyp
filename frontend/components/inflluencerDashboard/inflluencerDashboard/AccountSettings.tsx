import React, { useState, useEffect } from "react";
import { CogIcon, TrashIcon, BellIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface AccountSettings {
  email: string;
  password: string;
  isPrivate: boolean;
  notificationsEnabled: boolean;
}

const AccountSettings = () => {
  const [settings, setSettings] = useState<AccountSettings>({
    email: "",
    password: "",
    isPrivate: false,
    notificationsEnabled: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch account settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get<AccountSettings>("/api/user/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching account settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save account settings
  const handleSaveSettings = async () => {
    try {
      await axios.put("/api/user/settings", settings);
      toast.success("Settings updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings.");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/api/user");
      toast.success("Account deleted successfully!");
      // Redirect to login or home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account.");
    }
  };

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <CogIcon className="h-6 w-6 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Account Settings
        </h3>
      </div>
      <div className="mt-3 space-y-4">
        {/* Update Email/Password */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Update Email/Password
          </h4>
          <div className="mt-2 space-y-2">
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded-md"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={settings.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Privacy Settings
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="isPrivate"
              checked={settings.isPrivate}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Make my profile private
            </label>
          </div>
          <button
            onClick={handleSaveSettings}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Privacy Settings
          </button>
        </div>

        {/* Notification Settings */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Notification Settings
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Enable notifications
            </label>
          </div>
          <button
            onClick={handleSaveSettings}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Notification Settings
          </button>
        </div>

        {/* Delete Account */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Delete Account
          </h4>
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Are you sure you want to delete your account?
            </h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;