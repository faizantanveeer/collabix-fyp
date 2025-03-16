"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Bell,
  User,
  ArrowLeftCircle,
  ArrowRightCircle,
} from "lucide-react";

interface SidebarProps {
  role: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, setActiveSection }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); // Sidebar open/close state

  const sections = [
    { name: "Dashboard", icon: <LayoutDashboard /> },
    { name: "Collaborations", icon: <Users /> },
    { name: "Chat", icon: <MessageSquare /> },
    { name: "Notifications", icon: <Bell /> },
    { name: "Profile", icon: <User /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar - Fixed for Mobile, Relative for Desktop */}
      <div
        className={`bg-gray-900 text-white p-4 transition-all duration-300
          ${isOpen ? "w-64" : "w-16"} min-h-screen flex flex-col fixed md:relative z-50`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 right-[-14px] bg-gray-900 p-2 rounded-full shadow-lg z-50 transform -translate-y-1/2"
        >
          {/* Blinking Effect */}
          <div className="relative">
            <span className="absolute inset-0 w-full h-full animate-ping bg-gray-600 rounded-full opacity-75"></span>
            {isOpen ? (
              <ArrowLeftCircle size={28} className="text-white relative z-10" />
            ) : (
              <ArrowRightCircle size={28} className="text-white relative z-10" />
            )}
          </div>
        </button>

        {/* Sidebar Content */}
        {isOpen && (
          <h2 className="text-xl font-semibold mb-4 p-3">
            {role.toUpperCase()} Dashboard
          </h2>
        )}

        <ul className="mt-4 space-y-2">
          {sections.map((section) => (
            <li key={section.name} className="relative w-full">
              <button
                onClick={() => setActiveSection(section.name)}
                className={`w-full flex items-center justify-${isOpen ? "start" : "center"} gap-3 p-3 rounded-lg transition-all 
                  ${isOpen ? "hover:bg-gray-700" : "hover:bg-gray-800"} 
                  ${pathname === `/dashboard/${section.name.toLowerCase()}` ? "bg-gray-700" : ""}
                `}
              >
                {/* Icon - Enlarged when collapsed */}
                <span className={`flex items-center justify-center transition-all ${isOpen ? "w-6 h-6" : "w-9 h-9"}`}>
                  {React.cloneElement(section.icon, { size: isOpen ? 24 : 24 })}
                </span>

                {/* Text - Hidden when collapsed */}
                {isOpen && <span className="transition-opacity duration-300">{section.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      
    </div>
  );
};

export default Sidebar;
