"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Bell } from "lucide-react";
import { destroyCookie } from "nookies";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

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
          <Link href="/influencer">
            <Button variant="ghost">Influencers</Button>
          </Link>
          <Button variant="ghost">Businesses</Button>
          <Button variant="ghost">Contact</Button>
        </div>

        {/* Notification Bell (UI only) */}
        {session && (
          <div className="relative">
            <Button variant="outline" className="relative">
              <Bell className="h-6 w-6" />
            </Button>
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
