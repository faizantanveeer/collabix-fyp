"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "../../../components/Sidebar";
import Dashboard from "../../../components/influencer-components/Dashboard";
import Collaborations from "../../../components/influencer-components/Collaborations";
import Chat from "../../../components/influencer-components/Chat";
import Notifications from "../../../components/influencer-components/Notifications";
import Profile from "../../../components/influencer-components/Profile";
import { UserData } from "../../../types";

interface DashboardProps {
  userData: UserData | null;
}

const InfluencerDashboardPage = ({ userData }: DashboardProps) => {
  const [section, setSection] = useState("Dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar role="influencer" setSection={setSection} />
      <main className="flex-1 p-5">
        {section === "Dashboard" && <Dashboard userData={userData} />}
        {section === "Collaborations" && <Collaborations userData={userData} />}
        {section === "Chat" && <Chat />}
        {section === "Notifications" && <Notifications userData={userData} />}
        {section === "Profile" && <Profile userData={userData} />}
      </main>
    </div>
  );
};

export default InfluencerDashboardPage;
