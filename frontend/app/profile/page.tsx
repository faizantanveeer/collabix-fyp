"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Camera, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SocialLink {
  platform: string;
  url: string;
}

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "twitter", label: "Twitter", icon: "🐦" },
  { value: "youtube", label: "YouTube", icon: "📺" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "facebook", label: "Facebook", icon: "👥" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "pinterest", label: "Pinterest", icon: "📌" },
  { value: "snapchat", label: "Snapchat", icon: "👻" },
];

const Profile = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    platform: "",
    url: "",
  });

  const token = session?.accessToken;
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !userId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/user/profile/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setProfileData(data.profile);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, userId]);

  if (!profileData)
    return <p className="text-center text-gray-600">Loading profile...</p>;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        `http://localhost:5000/user/profile/upload/${userId}/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setProfileData({
        ...profileData,
        profileImage: data.profileImage,
      });

      console.log("Profile Data", profileData)

      toast.success("Profile image updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/user/profile/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setProfileData(updatedUser.profile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white shadow-lg rounded-xl p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              id="profileImage"
              src={profileData.profileImage 
                ? `http://localhost:5000/uploads/profiles/${profileData.profileImage}` 
                : "/images/placeholder.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-primary object-contain"
            />

            <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </label>
          </div>

          {isEditing ? (
            <Input
              className="mt-4 text-center text-xl font-semibold"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
            />
          ) : (
            <h1 className="mt-4 text-2xl font-bold">{profileData.name}</h1>
          )}

          <p className="text-gray-600">
            @{profileData.name.toLowerCase().replace(/\s+/g, "")}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold">
              {profileData.totalFollowers?.toLocaleString()}
            </p>
            <p className="text-gray-600">Total Followers</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold">
              {profileData.averageRating?.toFixed(1)}
            </p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold">{profileData.industry}</p>
            <p className="text-gray-600">Industry</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <Button onClick={handleSaveProfile} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      )}
    </div>
  );
};

export default Profile;
