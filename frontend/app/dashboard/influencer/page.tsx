"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/influencer-components/Dashboard";
import Collaborations from "@/components/influencer-components/Collaborations";
import Chat from "@/components/influencer-components/Chat";
import Notifications from "@/components/influencer-components/Notifications";
import Profile from "@/components/influencer-components/Profile";
import { UserData } from "@/types";

interface InfluencerDashboardProps {
  userData: UserData | null;
}

export default function InfluencerDashboard({ userData }: InfluencerDashboardProps) {
  const [activeSection, setActiveSection] = useState("Dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar remains fixed */}
      <Sidebar role="influencer" setActiveSection={setActiveSection} />

      {/* Right Side Content - Updates dynamically */}
      <main className="flex-1 p-5 h-full overflow-y-auto">
        {activeSection === "Dashboard" && <Dashboard userData={userData} />}
        {activeSection === "Collaborations" && <Collaborations userData={userData} />}
        {activeSection === "Chat" && <Chat />}
        {activeSection === "Notifications" && <Notifications userData={userData} />}
        {activeSection === "Profile" && <Profile userData={userData} />}
      </main>
    </div>
  );
}
