"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import InfluencerDashboard from "../dashboard/influencer/page";
import BusinessDashboard from "../dashboard/business/page";
import { UserData } from "../../types";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const fetchUserProfile = async () => {
    // console.log("Access Token:", session?.accessToken);

    const res = await fetch("http://localhost:5000/dashboard", {
      method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`, // Send token
        },
      credentials: "include", // Send cookies automatically
    });

    const data = await res.json();
    
    // console.log(userData);


    setUserData(data);
  };

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (!session?.user) {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchUserProfile();
      // console.log("Session:", session);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!session?.user) return null; // Avoid rendering if user is not logged in

  // Convert role to lowercase
  const userRole = session.user.role?.toLowerCase();

  return (
    <div className="h-screen overflow-y-hidden">
      <Navbar />

      {/* <InfluencerDashboard userData={userData} /> */}
      {userRole === "influencer" ? (
        <InfluencerDashboard userData={userData} />
      ) :  (
        <BusinessDashboard userData={userData} />
      ) }
    </div>
  );
}
