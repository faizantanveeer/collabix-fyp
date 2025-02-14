"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserProfile();
    }
  }, [status]);

  const fetchUserProfile = async () => {
    // console.log("Access Token:", session?.accessToken);

    const res = await fetch("http://localhost:5000/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`, // Send token
      },
      credentials: "include", // Send cookies automatically
    });


    const data = await res.json();
    // console.log(data.data.name);
    setUserData(data.data);

    // console.log("User Data:", userData.name);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return (window.location.href = "/login");

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Name: {userData?.name || "Loading..."}</p>
      <p>Role: {userData?.role || "Loading..."}</p>
    </div>
  );
}
