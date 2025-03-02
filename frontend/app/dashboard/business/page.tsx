"use client";
import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Dashboard from "../../../components/business-components/Dashboard";
import Collaborations from "../../../components/business-components/Collaborations";
import Chat from "../../../components/business-components/Chat";
import Notifications from "../../../components/business-components/Notifications";
import Profile from "../../../components/business-components/Profile";
import { UserData } from "../../types";

interface BusinessDashboardProps {
  userData: UserData | null;
}

const BusinessDashboardPage = ({ userData }: BusinessDashboardProps) => {
  const [section, setSection] = useState("Dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar role="business" setSection={setSection} />
      <main className="flex-1 p-5">
        {section === "Dashboard" && <Dashboard />}
        {section === "Collaborations" && <Collaborations />}
        {section === "Chat" && <Chat />}
        {section === "Notifications" && <Notifications />}
        {section === "Profile" && <Profile />}
      </main>
    </div>
  );
};

export default BusinessDashboardPage;
