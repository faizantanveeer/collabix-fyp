"use client";
import React from "react";

const Sidebar = ({ role, setSection }: { role: "business" | "influencer"; setSection: (section: string) => void }) => {
  const menuItems = role === "business"
    ? ["Dashboard", "Collaborations", "Chat", "Notifications", "Profile"]
    : ["Dashboard", "Collaborations", "Chat", "Notifications", "Profile"];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-5">
      {/* <h2 className="text-xl font-bold mb-5">Collabix</h2> */}
      <ul>
        {menuItems.map((item) => (
          <li key={item} className="py-2 px-3 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setSection(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
