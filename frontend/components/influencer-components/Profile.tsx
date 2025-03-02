"use client";

import { UserData } from "../../types";

interface ProfileProps {
  userData: UserData | null;
}

const Profile = ({ userData }: ProfileProps) => {
  if (!userData) return <p className="text-center text-gray-600">No profile data available.</p>;

  const profile = userData.profile;
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <img
          src={profile.image || "https://i.pravatar.cc/150?img=10"} // Default if no image
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
        <h2 className="text-xl font-semibold mt-3">{profile.name}</h2>
        <p className="text-gray-600">@{profile.username || "username"}</p>
      </div>

      {/* Bio */}
      <p className="mt-4 text-center text-gray-700">
        {profile.bio || "No bio available. Add one!"}
      </p>

      {/* Stats */}
      <div className="flex justify-around mt-6">
        <div className="text-center">
          <h3 className="text-lg font-bold">{profile.totalFollowers || "0"}</h3>
          <p className="text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold">{profile.reach || "N/A"}</h3>
          <p className="text-gray-500">Reach</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold">{profile.engagement || "0%"}</h3>
          <p className="text-gray-500">Engagement</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex justify-center space-x-4 mt-5">
        <a href={profile.instagram || "#"} target="_blank" className="text-pink-500 text-lg">
          🔗 Instagram
        </a>
        <a href={profile.twitter || "#"} target="_blank" className="text-blue-400 text-lg">
          🔗 Twitter
        </a>
        <a href={profile.linkedin || "#"} target="_blank" className="text-blue-600 text-lg">
          🔗 LinkedIn
        </a>
      </div>

      {/* Edit Button */}
      <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg">
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
