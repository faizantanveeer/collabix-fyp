"use client";

import { signIn } from "next-auth/react"; // Import signIn from NextAuth
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    influencerDetails: {
      socialLinks: [""],
      followerCount: "",
      category: "Tech",
    },
    businessDetails: { companyName: "", website: "", industry: "Retail" },
  });
  const [error, setError] = useState("");

  // Handle General Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Nested Input Changes
  const handleNestedChange = (
    section: "influencerDetails" | "businessDetails",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Handle Social Links Input Changes
  const handleSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedLinks = [...prev.influencerDetails.socialLinks];
      updatedLinks[index] = value;
      return {
        ...prev,
        influencerDetails: {
          ...prev.influencerDetails,
          socialLinks: updatedLinks,
        },
      };
    });
  };

  // Handle Next Step
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      step === 1 &&
      (!formData.name.trim() || !formData.email.trim() || !formData.password)
    ) {
      setError("Please enter all required fields.");
      return;
    }
    if (step === 2 && !formData.role) {
      setError("Please select a role.");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  // Handle Previous Step
  const handlePreviousStep = () => setStep(step - 1);

  // Handle Signup Request

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      influencerDetails:
        formData.role === "influencer" ? formData.influencerDetails : undefined,
      businessDetails:
        formData.role === "business" ? formData.businessDetails : undefined,
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

      // 🚀 Automatically Log In After Signup
      const loginResponse = await signIn("credentials", {
        redirect: false, // Prevents redirection, so you handle it manually
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse?.error) {
        setError("Login failed after signup.");
        return;
      }

      // Redirect to homepage or dashboard after successful login
      window.location.href = "/";
    } catch (error: any) {
      console.error("Signup Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-semibold mb-6">
          {step === 1
            ? "Create Account"
            : step === 2
            ? "Select Your Role"
            : "Additional Details"}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleNextStep}>
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
            <Button type="submit" className="w-full py-2">
              Next
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNextStep}>
            <div className="flex justify-center gap-4 my-9">
              <Button
                type="button"
                variant={formData.role === "business" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, role: "business" })}
              >
                Business
              </Button>
              <Button
                type="button"
                variant={formData.role === "influencer" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, role: "influencer" })}
              >
                Influencer
              </Button>
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant={"outline"}
                onClick={handlePreviousStep}
                className="w-1/3 mr-2"
              >
                Back
              </Button>
              <Button type="submit" className="w-2/3 py-2">
                Next
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSignup}>
            {/* Common Fields */}
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="mb-4"
            />

            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="mb-4"
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="mb-4"
            />

            {/* Role Selection */}
            <div className="flex justify-left gap-4 mb-4 items-center">
              <p className="text-md font-semibold ">Your Role</p>
              <Button
                type="button"
                variant={formData.role === "business" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, role: "business" })}
              >
                Business
              </Button>
              <Button
                type="button"
                variant={formData.role === "influencer" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, role: "influencer" })}
              >
                Influencer
              </Button>
            </div>

            {/* Influencer Form */}
            {formData.role === "influencer" && (
              <>
                <Input
                  name="followerCount"
                  value={formData.influencerDetails.followerCount || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "influencerDetails",
                      "followerCount",
                      e.target.value
                    )
                  }
                  placeholder="Follower Count"
                  className="mb-4"
                />

                {formData.influencerDetails.socialLinks.map((link, index) => (
                  <Input
                    key={index}
                    value={link}
                    onChange={(e) => handleSocialLinkChange(e, index)}
                    placeholder="Social Media Link"
                    className="mb-4"
                  />
                ))}

                <select
                  name="category"
                  value={formData.influencerDetails.category || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "influencerDetails",
                      "category",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded mb-4"
                >
                  <option value="">Select Category</option>
                  <option value="Tech">Tech</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food">Food</option>
                </select>
              </>
            )}

            {/* Business Form */}
            {formData.role === "business" && (
              <>
                <Input
                  name="companyName"
                  value={formData.businessDetails.companyName || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessDetails",
                      "companyName",
                      e.target.value
                    )
                  }
                  placeholder="Company Name"
                  className="mb-4"
                />

                <Input
                  name="website"
                  value={formData.businessDetails.website || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessDetails",
                      "website",
                      e.target.value
                    )
                  }
                  placeholder="Company Website"
                  className="mb-4"
                />

                <Input
                  name="industry"
                  value={formData.businessDetails.industry || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessDetails",
                      "industry",
                      e.target.value
                    )
                  }
                  placeholder="Industry (e.g., Tech, Fashion)"
                  className="mb-4"
                />
              </>
            )}
            <div className="flex justify-between">
              <Button
                type="button"
                variant={"outline"}
                onClick={handlePreviousStep}
                className="w-1/3 mr-2"
              >
                Back
              </Button>
              <Button type="submit" className="w-2/3 py-2">
                Next
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
