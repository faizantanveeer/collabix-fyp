"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Heart,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"; // Better back icon
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChatbotWidget from "@/components/Chatbot";

const ITEMS_PER_PAGE = 12;

interface Influencer {
  id: string;
  name: string;
  image: string;
  niche: string;
  followers: string;
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("All");

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("http://localhost:5000/influencers");
        if (!response.ok) {
          console.error(`HTTP Error: ${response.status}`);
          return;
        }
        const data = await response.json();
        setInfluencers(data);
        setLoading(false);
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchInfluencers();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // Filter influencers based on search & niche
  const filteredInfluencers = influencers.filter(
    (influencer) =>
      influencer.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedNiche === "All" || influencer.niche === selectedNiche)
  );

  const totalPages = Math.ceil(filteredInfluencers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleInfluencers = filteredInfluencers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Niches
  const niches = [
    "Technology",
    "Fashion",
    "Fitness",
    "Gaming",
    "Food",
    "Travel",
    "Beauty",
    "Education",
    "Finance",
  ];

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Influencers Button */}
        <div className="mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span className="text-lg font-semibold">Back to Home</span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Top Influencers
        </h1>

        {/* Search & Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-1/2">
            <Search
              className="absolute left-3 top-2.5 text-gray-500"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search influencers..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-1/4">
            <Filter
              className="absolute left-3 top-2.5 text-gray-500"
              size={20}
            />

            <Select value={selectedNiche} onValueChange={setSelectedNiche}>
              <SelectTrigger className="w-full pl-10">
                <SelectValue placeholder="Select a niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Niches</SelectItem>
                {niches.map((niche) => (
                  <SelectItem key={niche} value={niche}>
                    {niche}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="w-full h-60 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visibleInfluencers.map((influencer) => (
              <Card
                key={influencer.id}
                className="relative bg-white/30 dark:bg-gray-900/40 shadow-xl backdrop-blur-lg rounded-xl overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <Link href={`/influencer/${influencer.id}`} className="block">
                  <Image
                    src={
                      influencer.image
                        ? influencer.image.startsWith("http")
                          ? influencer.image // ✅ Google or any direct image URL
                          : influencer.image.startsWith("/images/")
                          ? influencer.image // ✅ Local static placeholder
                          : `http://localhost:5000/uploads/profiles/${influencer.image}` // ✅ Uploaded profile
                        : "/images/placeholder.png" // ✅ Fallback
                    }
                    alt={influencer.name}
                    width={300}
                    height={300}
                    className="w-full h-60 object-cover rounded-t-xl"
                  />
                </Link>

                <button
                  onClick={() => toggleFavorite(influencer.id)}
                  className="absolute top-2 right-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-full shadow-md hover:bg-red-100 transition"
                >
                  <Heart
                    size={24}
                    className={
                      favorites.includes(influencer.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }
                  />
                </button>

                <CardContent className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {influencer.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {influencer.niche}
                  </p>
                  <p className="text-blue-500 font-bold mt-2">
                    {influencer.followers} Followers
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <ChatbotWidget />
      </div>
    </>
  );
}
