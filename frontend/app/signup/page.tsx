"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Signup failed.");

      const loginResponse = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse?.error) {
        setError("Login failed after signup.");
        return;
      }

      window.location.href = "/";
    } catch (error: any) {
      console.error("Signup Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-semibold mb-6">Create Account</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSignup}>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="mb-4"
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="mb-4"
          />
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="mb-4"
          />

          <div className="flex justify-center gap-4 my-6">
            <Button
              type="button"
              variant={formData.role === "business" ? "default" : "outline"}
              onClick={() => setFormData(prev => ({ ...prev, role: "business" }))}
            >
              Business
            </Button>
            <Button
              type="button"
              variant={formData.role === "influencer" ? "default" : "outline"}
              onClick={() => setFormData(prev => ({ ...prev, role: "influencer" }))}
            >
              Influencer
            </Button>
          </div>

          <Button type="submit" className="w-full py-2">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
