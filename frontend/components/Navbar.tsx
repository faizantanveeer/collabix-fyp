"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Bell } from "lucide-react";
import { destroyCookie } from "nookies";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

// Lazy initialization of socket (avoid hydration errors)
let socket: Socket | null = null;

interface Notification {
  _id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export function Navbar() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection only on client
    if (!socket) {
      socket = io("http://localhost:5000");
    }

    socket.emit("join", userId);

    // Fetch notifications from API
    axios
      .get(`http://localhost:5000/notifications/${userId}`)
      .then((res) => setNotifications(res.data.notifications))
      .catch((err) => console.error("Error fetching notifications:", err));

    // Listen for new notifications
    socket.on("newNotification", (notification) => {
      setNotifications((prev) =>
        prev.some((n) => n._id === notification._id) ? prev : [notification, ...prev]
      );
    });

    return () => {
      if (socket) {
        socket.off("newNotification");
        socket.disconnect();
      }
    };
  }, [userId]);

  const handleResponse = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/notifications/update/${id}`,
        { status }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? data.notification : n))
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const signoutHandler = async () => {
    try {
      destroyCookie(null, "token", { path: "/" });
      signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-lg bg-background relative">
      <Link href="/">
        <h1 className="text-xl font-bold">Collabix</h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* Navigation Links */}
        <div className="hidden md:flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/influencer"><Button variant="ghost">Influencers</Button></Link>
          <Button variant="ghost">Businesses</Button>
          <Button variant="ghost">Contact</Button>
        </div>

        {/* Notification Bell */}
        {session && (
          <div className="relative">
            <Button
              variant="outline"
              className="relative"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Bell className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>

            {/* Notification Dropdown with Framer Motion Animation */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50"
                >
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-gray-500">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className="p-3 border-b">
                        <p>{n.message}</p>
                        {n.status === "pending" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleResponse(n._id, "accepted")}
                              className="bg-green-500 text-white px-3 py-1 text-sm rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleResponse(n._id, "rejected")}
                              className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {n.status !== "pending" && (
                          <p className="text-sm text-gray-500">
                            Status: {n.status}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Authentication Buttons */}
        {status === "loading" ? (
          <Button variant="outline" disabled>
            <Loader2 className="animate-spin h-5 w-5" />
          </Button>
        ) : session ? (
          <>
            <Link href="/profile">
              <Button variant="secondary">Profile</Button>
            </Link>
            <Button variant="destructive" onClick={signoutHandler}>
              Log Out
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
