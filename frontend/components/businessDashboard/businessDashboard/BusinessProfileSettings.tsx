import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface BusinessProfile {
  companyName: string;
  industry: string;
  website: string;
}

const BusinessProfileSettings = () => {
  // Initialize the profile state with the default values
  const [profile, setProfile] = useState<BusinessProfile>({
    companyName: "Nike",
    industry: "Sportswear",
    website: "https://nike.com",
  });
  
  // States for editing mode and updated profile values
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<Partial<BusinessProfile>>({
    companyName: profile.companyName,
    industry: profile.industry,
    website: profile.website,
  });

  // Handle input changes when editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put<BusinessProfile>("/api/business/profile", updatedProfile);
      setProfile(response.data); // Update profile with the new data
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Business Profile Settings
      </h3>
      <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
        {isEditing ? (
          <>
            {/* Edit mode for the profile */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={updatedProfile.companyName || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Industry</label>
              <input
                type="text"
                name="industry"
                value={updatedProfile.industry || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Website</label>
              <input
                type="text"
                name="website"
                value={updatedProfile.website || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {/* View mode for the profile */}
            <p>Company Name: {profile.companyName}</p>
            <p>Industry: {profile.industry}</p>
            <p>Website: {profile.website}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessProfileSettings;
