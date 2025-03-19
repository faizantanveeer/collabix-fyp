"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Users,
  Briefcase,
  Mail,
} from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<{
    profileImage: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfileData();
    }
  }, [session]);

  async function fetchProfileData() {
    try {
      const res = await fetch(
        `http://localhost:5000/user/profile/${session?.user?.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setProfileData({ profileImage: data.profile.profileImage });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white text-gray-900 relative">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold  text-gray-900 flex justify-center items-center">
        <Image
          src={"/images/logo.png"}
          alt={"Logo"}
          width={50}
          height={50}
          className=""
        />
        Collabix
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 ">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-1xl">Dashboard</Button>
        </Link>
        <Link href="/influencer">
          <Button variant="ghost" className="text-1xl">Influencers</Button>
        </Link>
        <Link href="/businesses">
          <Button variant="ghost" className="text-1xl">Businesses</Button>
        </Link>
        <Link href="/contact">
          <Button variant="ghost" className="text-1xl">Contact</Button>
        </Link>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        {session ? (
          <div className="relative hidden md:block" ref={dropdownRef}>
            {/* Profile Image (Only for Desktop) */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hidden md:flex items-center gap-2 focus:outline-none"
            >
              <img
                src={
                  profileData?.profileImage
                    ? `http://localhost:5000/uploads/profiles/${profileData.profileImage}`
                    : "/images/placeholder.png"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border p-1 cursor-pointer"
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-50">
                <Link href="/profile">
                  <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer transition-colors">
                    <User size={18} /> Profile
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-200 hover:text-red-500 cursor-pointer transition-colors"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn size={18} /> Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="default"
                className="flex items-center gap-2 bg-gray-900"
              >
                <UserPlus size={18} /> Sign Up
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none transition-transform duration-300 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 md:hidden z-40`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <Link href="/" className="text-2xl font-bold">
            Menu
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-6 mt-4">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className="w-full text-left flex items-center gap-2"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Button>
          </Link>
          <Link href="/influencer" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className="w-full text-left flex items-center gap-2"
            >
              <Users size={18} /> Influencers
            </Button>
          </Link>
          <Link href="/businesses" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className="w-full text-left flex items-center gap-2"
            >
              <Briefcase size={18} /> Businesses
            </Button>
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className="w-full text-left flex items-center gap-2"
            >
              <Mail size={18} /> Contact
            </Button>
          </Link>
        </div>

        {/* Profile & Logout Section in Mobile Menu */}
        <div className="mt-4 px-6 border-t">
          {session ? (
            <>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 mt-4 px-6"
                >
                  <User size={18} /> Profile
                </Button>
              </Link>
              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="w-full text-left hover:text-red-500 flex items-center gap-2"
              >
                <LogOut size={18} /> Log Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-4 px-6 ">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 mt-4 px-6"
                >
                  <LogIn size={18} /> Log In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full text-left flex items-center gap-2 mt-4 px-6"
                >
                  <UserPlus size={18} /> Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
