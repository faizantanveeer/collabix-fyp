"use client";
import { useState } from "react";
import Sidebar from "../../../components/Sidebar";

import { UserData } from "../../../types";

interface BusinessDashboardProps {
  userData: UserData | null;
}

const BusinessDashboardPage = ({ userData }: BusinessDashboardProps) => {
  const [section, setSection] = useState("Dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar role="business" setSection={setSection} />
      
    </div>
  );
};

export default BusinessDashboardPage;
