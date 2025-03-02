import React, { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Profile {
  name: string;
  bio: string;
  location: string;
  niche: string;
  socialLinks: string[];
  followerCount: number;
}

const ProfileSettings = () => {
  const [profile, setProfile] = useState<Profile>({
    name: "Waleed",
    bio: "Fitness Influencer",
    location: "New York, USA",
    niche: "Fitness",
    socialLinks: ["Instagram", "YouTube", "TikTok"],
    followerCount: 500000,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<Partial<Profile>>({});

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<Profile>("/api/user/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put<Profile>("/api/user/profile", updatedProfile);
      setProfile(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <UserIcon className="h-6 w-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Profile Settings
        </h3>
      </div>
      <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={updatedProfile.name || profile.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={updatedProfile.bio || profile.bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={updatedProfile.location || profile.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Niche</label>
              <input
                type="text"
                name="niche"
                value={updatedProfile.niche || profile.niche}
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
            <p>Name: {profile.name}</p>
            <p>Bio: {profile.bio}</p>
            <p>Location: {profile.location}</p>
            <p>Niche: {profile.niche}</p>
            <p>Social Media Links: {profile.socialLinks?.join(", ")}</p>
            <p>Follower Count: {profile.followerCount?.toLocaleString()}</p>
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

export default ProfileSettings;