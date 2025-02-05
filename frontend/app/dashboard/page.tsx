"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return; // Wait until session is fully loaded

    }

    console.log("Session: ",session)
    console.log("Status: ", session)
    if (!session) {
      router.push("/login");
    } else if (session && session.accessToken) {
      // Fetch user data after session is loaded
      fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          router.push("/login"); // Redirect to login on error
        });
    }
  }, [session, status, router]);

  // Show loading text while waiting for user data
  if (status === "loading" || !user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {user.role === "Influencer" ? (
        <div>
          <h2>Influencer Dashboard</h2>
        </div>
      ) : user.role === "Business" ? (
        <div>
          <h2>Business Dashboard</h2>
        </div>
      ) : (
        <div>
          <h2>Unknown Role</h2>
        </div>
      )}
    </div>
  );
}
