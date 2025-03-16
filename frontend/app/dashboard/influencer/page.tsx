"use client";
import { useState, lazy, Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/influencer-components/Dashboard";
import Chat from "@/components/influencer-components/Chat";
import Notifications from "@/components/influencer-components/Notifications";
import Profile from "@/components/influencer-components/Profile";
import { UserData } from "@/types";

// Lazy load the Collaborations component
const Collaborations = lazy(() => import("@/components/influencer-components/Collaborations"));

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
        {activeSection === "Collaborations" && (
          <Suspense fallback={<div>Loading...</div>}>
            <Collaborations userData={userData} />
          </Suspense>
        )}
        {activeSection === "Chat" && <Chat />}
        {activeSection === "Notifications" && <Notifications userData={userData} />}
        {activeSection === "Profile" && <Profile userData={userData} />}
      </main>
    </div>
  );
}
