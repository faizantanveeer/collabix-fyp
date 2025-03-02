"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // ShadCN button
import { FaInstagram, FaTwitter, FaYoutube, FaEnvelope } from "react-icons/fa";
import { toast } from "sonner"; // Notification library
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react"; // Import message icon
import Navbar from "@/components/Navbar";

export default function InfluencerProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState("65d1234567abc890"); // Replace with actual logged-in business ID

  const handleCollab = () => {
    if (influencer) {
      router.push(`/collaboration?id=${id}`);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      setBusinessId(session.user.id);
    }
    const fetchInfluencer = async () => {
      try {
        const res = await fetch(`http://localhost:5000/influencers/${id}`);
        const data = await res.json();
        console.log(data);
        setInfluencer(data);
      } catch (error) {
        console.error("Error fetching influencer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencer();
  }, [id]);

  if (loading)
    return (
      <h1 className="text-center text-gray-500 text-2xl mt-10">Loading...</h1>
    );
  if (!influencer)
    return (
      <h1 className="text-center text-red-500 text-2xl mt-10">
        Influencer Not Found
      </h1>
    );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-3xl">
        {/* Back Button */}
        <Link href="/influencer">
          <Button variant="outline" className="mb-6">
            ⬅ Back to Influencers
          </Button>
        </Link>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
          <Image
            src={influencer.profileImage || "/images/placeholder.jpg"}
            alt={influencer.name}
            width={200}
            height={200}
            className="rounded-full border-4 border-blue-500 shadow-md"
          />
          <h1 className="text-3xl font-bold mt-4">{influencer.name}</h1>
          <p className="text-gray-500 text-lg">{influencer.niche}</p>
          <p className="text-blue-500 font-bold text-xl">
            Followers: {influencer.influencerDetails.followerCount}{" "}
          </p>
          <p className="text-gray-700 mt-4">{influencer.bio}</p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            {influencer.socialLinks?.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                className="text-2xl hover:opacity-75"
              >
                {social.platform === "Instagram" && (
                  <FaInstagram className="text-pink-500" />
                )}
                {social.platform === "Twitter" && (
                  <FaTwitter className="text-blue-400" />
                )}
                {social.platform === "YouTube" && (
                  <FaYoutube className="text-red-500" />
                )}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full mt-6">
            {session?.user?.role === "business" ? (
              <>
                <Button onClick={handleCollab} className="flex-1">
                  Collaborate
                </Button>
              </>
            ) : (
              <div className="w-full">
                <Button className="cursor-not-allowed w-full">
                  Collaborate
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Please sign up as a business to collaborate with influencers
                </p>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => router.push(`/chat/${id}`)}
              className="flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Message
            </Button>
          </div>
        </div>

        {/* Collaborations & Achievements Section */}
        <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center">
            🏆 Top Collaborations & Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="text-xl font-bold">Brand Collaborations</h3>
              <ul className="list-disc list-inside text-gray-700">
                {influencer.influencerDetails?.pastCollaborations?.map(
                  (brand, index) => (
                    <li key={index}>{brand}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold">Achievements</h3>
              <ul className="list-disc list-inside text-gray-700">
                {influencer.portfolio?.map((item, index) => (
                  <li key={index}>{item.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
