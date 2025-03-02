"use client";
import React from "react";

interface SidebarProps {
  role: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, setActiveSection }) => {
  const sections = ["Dashboard", "Collaborations", "Chat", "Notifications", "Profile"];

  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">{role.toUpperCase()} Dashboard</h2>
      <ul>
        {sections.map((section) => (
          <li
            key={section}
            onClick={() => setActiveSection(section)}
            className="cursor-pointer p-2 hover:bg-gray-700 transition"
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
