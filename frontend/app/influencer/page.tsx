"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("http://localhost:5000/influencers"); // Adjust URL if deployed
        const data = await response.json();
        setInfluencers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching influencers:", error);
        setLoading(false);
      }
    };

    // console.log(influencers)

    fetchInfluencers();
  }, []);

  const totalPages = Math.ceil(influencers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleInfluencers = influencers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Top Influencers</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleInfluencers.map((influencer) => (
              <Link key={influencer.id} href={`/influencer/${influencer.id}`} className="cursor-pointer">
                <div className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                  <Image
                    src={"/images/placeholder.png"} 
                    alt={influencer.name}
                    width={300}
                    height={300}
                    className="w-full h-60 object-contain"
                  />
                  <div className="p-4 text-center">
                    <h2 className="text-lg font-semibold">{influencer.name}</h2>
                    <p className="text-gray-600">{influencer.bio}</p>
                    <p className="text-blue-500 font-bold">{influencer.followers} Followers</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              page > 1 ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            ⬅ Previous
          </button>

          <span className="text-lg font-bold">{page} / {totalPages}</span>

          <button
            className={`px-4 py-2 rounded-lg ${
              page < totalPages ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next ➡
          </button>
        </div>
      </div>
    </>
  );
}
