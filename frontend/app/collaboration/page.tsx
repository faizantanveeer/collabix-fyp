"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import Navbar from "@/components/Navbar";

const collaborationTypes = {
  "sponsored-post":
    "An influencer will create a dedicated post for your brand.",
  "product-review":
    "The influencer will review your product with honest feedback.",
  shoutout: "A quick mention in an influencer's post/story.",
  "brand-ambassador":
    "A long-term collaboration with the influencer for brand awareness.",
};

export default function Collaborate() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const id = params.get("id");

  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    budget: "",
    description: "",
    deliverables: "",
    deadline: "",
    collaborationType: "sponsored-post",
    file: null,
  });

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`http://localhost:5000/influencers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch influencer");
        return res.json();
      })
      .then(setInfluencer)
      .catch(() => toast.error("Error fetching influencer"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSelectChange = (value) =>
    setForm((prev) => ({ ...prev, collaborationType: value }));

  const handleFileChange = (e) =>
    setForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }));

  const isFormValid = Object.values(form).every((value) => value);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const {
        budget,
        description,
        deliverables,
        deadline,
        collaborationType,
        file,
      } = form;

      if (
        !budget ||
        !description ||
        !deliverables ||
        !deadline ||
        !collaborationType
      ) {
        toast.error("Please fill all required fields!");
        return;
      }

      // Retrieve stored requests from sessionStorage
      const storedRequests = JSON.parse(
        sessionStorage.getItem("sentRequests") || "[]"
      );

      // Check if a duplicate request exists
      const duplicateRequest = storedRequests.some(
        (req) =>
          req.influencer === id &&
          req.budget === budget &&
          req.description === description &&
          req.deliverables === deliverables &&
          req.deadline === deadline &&
          req.collaborationType === collaborationType
      );

      if (duplicateRequest) {
        toast.error("You have already sent this collaboration request!");
        return;
      }

      const formData = new FormData();
      if (session?.user?.id) {
        formData.append("business", session.user.id);
        formData.append("influencer", id || "");
        formData.append("campaign", collaborationType);
        formData.append("budget", budget);
        formData.append("description", description);
        formData.append("deliverables", deliverables);
        formData.append("deadline", deadline);
        if (file) formData.append("file", file);
      } else {
        toast.error("User session not found!");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/collaboration/create",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.isDuplicate) {
          toast.error("Duplicate Request Detected!");
        } else {
          const newRequest = {
            influencer: id,
            budget,
            description,
            deliverables,
            deadline,
            collaborationType,
          };
          sessionStorage.setItem(
            "sentRequests",
            JSON.stringify([...storedRequests, newRequest])
          );
          toast.success("Request Sent Successfully");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
    [form, id, session]
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!influencer)
    return (
      <p className="text-center mt-10 text-red-500">Influencer not found!</p>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">
            Send Collaboration Request
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                      {type.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="number"
              name="budget"
              placeholder="Budget (PKR)"
              value={form.budget}
              onChange={handleChange}
            />
            <Textarea
              name="deliverables"
              placeholder="Expected Deliverables"
              value={form.deliverables}
              onChange={handleChange}
            />
            <Input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Project Description"
              value={form.description}
              onChange={handleChange}
            />
            <Input
              type="file"
              accept=".pdf,.docx,.png,.jpg"
              onChange={handleFileChange}
            />
            <Button type="submit" className="w-full mt-4">
              Submit Request
            </Button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Card className="p-4 flex items-center space-x-4">
            <Image
              src={
                influencer.profileImage &&
                !influencer.profileImage.startsWith("/images/")
                  ? `http://localhost:5000/uploads/profiles/${influencer.profileImage}`
                  : "/images/placeholder.png"
              }
              alt={influencer?.name || "Influencer"}
              width={80}
              height={80}
              className="w-[80px] h-[80px] rounded-full border-4 border-blue-500 shadow-md object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{influencer.name}</h2>
              <p className="text-gray-500">{influencer.niche}</p>
              <p className="text-blue-500 font-bold">
                Followers: {influencer.influencerDetails.followerCount}
              </p>
            </div>
          </Card>
          <div className="mt-6">
            <h2 className="text-lg font-semibold">📌 Collaboration Type</h2>
            <p className="text-gray-700">
              {collaborationTypes[form.collaborationType]}
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">💰 Budget</h2>
            <p className="text-gray-700">
              {form.budget ? `PKR ${form.budget}` : "Not specified yet"}
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">📦 Expected Deliverables</h2>
            <p className="text-gray-700">
              {form.deliverables || "Not specified yet"}
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">📅 Deadline</h2>
            <p className="text-gray-700">
              {form.deadline || "Not specified yet"}
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">📝 Description</h2>
            <p className="text-gray-700">
              {form.description || "No description added yet"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
