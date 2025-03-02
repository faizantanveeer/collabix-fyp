"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner"; // Notifications
import { useSearchParams } from "next/navigation";

type CollaborationType = {
  [key: string]: { title: string; desc: string };
};

const collaborationTypes: CollaborationType = {
  "sponsored-post": {
    title: "Sponsored Post",
    desc: "An influencer will create a dedicated post for your brand.",
  },
  "product-review": {
    title: "Product Review",
    desc: "The influencer will review your product with honest feedback.",
  },
  shoutout: {
    title: "Shoutout",
    desc: "A quick mention in an influencer's post/story.",
  },
  "brand-ambassador": {
    title: "Brand Ambassador",
    desc: "A long-term collaboration with the influencer for brand awareness.",
  },
};

interface CollaborationForm {
  budget: string;
  description: string;
  deliverables: string;
  deadline: string;
  collaborationType: string;
  file: File | null;
}

export default function Collaborate() {
  const params = useSearchParams();
  const id = params.get("id")
  const [influencer, setInfluencer] = useState(null);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<CollaborationForm>({
    budget: "",
    description: "",
    deliverables: "",
    deadline: "",
    collaborationType: "sponsored-post",
    file: null,
  });

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/influencers/${id}`
        );
        const data = await response.json();
        setInfluencer(data);
        console.log(influencer)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching influencer:", error);
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setForm({ ...form, collaborationType: value });
  };


  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, file: e.target.files ? e.target.files[0] : null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.budget ||
      !form.description ||
      !form.deliverables ||
      !form.deadline
    ) {
      return toast.error("Please fill all required fields!");
    }

    toast.success("Collaboration request submitted!");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!influencer)
    return (
      <p className="text-center mt-10 text-red-500">Influencer not found!</p>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Side - Form Inputs */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Send Collaboration Request</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Collaboration Type */}
          <div>
            <Label>Collaboration Type</Label>
            <Select
              defaultValue="sponsored-post"
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(collaborationTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    {collaborationTypes[type].title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div>
            <Label>Estimated Budget (PKR)</Label>
            <Input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
            />
          </div>

          {/* Deliverables */}
          <div>
            <Label>Expected Deliverables</Label>
            <Textarea
              name="deliverables"
              value={form.deliverables}
              onChange={handleChange}
              placeholder="E.g., Instagram post, YouTube video, etc."
            />
          </div>

          {/* Deadline */}
          <div>
            <Label>Deadline</Label>
            <Input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Project Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the collaboration idea..."
            />
          </div>

          {/* File Upload */}
          <div>
            <Label>Attach Brief (Optional)</Label>
            <Input
              type="file"
              accept=".pdf,.docx,.png,.jpg"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4">
            Submit Collaboration Request
          </Button>
        </form>
      </div>

      {/* Right Side - Dynamic Preview */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Influencer Info */}
        <Card className="p-4 flex items-center space-x-4">
          <Image
            src={influencer.image || "/images/placeholder.jpg"}
            alt={influencer.name}
            width={80}
            height={80}
            className="rounded-full border"
          />
          <div>
            <h2 className="text-xl font-semibold">{influencer.name}</h2>
            <p className="text-gray-500">{influencer.niche}</p>
            <p className="text-blue-500 font-bold">
            Followers: {influencer.influencerDetails.followerCount} 
            </p>
          </div>
        </Card>

        {/* Collaboration Type Preview */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">📌 Collaboration Type</h2>
          <p className="text-gray-700">
            {collaborationTypes[form.collaborationType].desc}
          </p>
        </div>

        {/* Budget Preview */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">💰 Budget</h2>
          <p className="text-gray-700">
            {form.budget ? `PKR ${form.budget}` : "Not specified yet"}
          </p>
        </div>

        {/* Deliverables Preview */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">📦 Expected Deliverables</h2>
          <p className="text-gray-700">
            {form.deliverables || "Not specified yet"}
          </p>
        </div>

        {/* Deadline Preview */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">📅 Deadline</h2>
          <p className="text-gray-700">
            {form.deadline || "Not specified yet"}
          </p>
        </div>

        {/* Description Preview */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">📝 Description</h2>
          <p className="text-gray-700">
            {form.description || "No description added yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
