"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import InfluencerDashboard from "@/components/InfluencerDashboard";
import BusinessDashboard from "@/components/BusinessDashboard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session:", session);

    if (status === "loading") return; // Wait for session to load
    if (!session?.user) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  if (!session?.user) return null; // Avoid rendering if user is not logged in

  // Convert role to lowercase
  const userRole = session.user.role?.toLowerCase();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
      {userRole === "influencer" ? (
        <InfluencerDashboard />
      ) : userRole === "business" ? (
        <BusinessDashboard />
      ) : (
        <UnknownRole />
      )}
    </div>
  );
}


function UnknownRole() {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Unknown Role</h2>
      <p>Please contact support if this is incorrect.</p>
    </div>
  );
}
