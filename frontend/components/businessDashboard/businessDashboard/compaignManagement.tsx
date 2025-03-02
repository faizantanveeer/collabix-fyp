// CampaignManagement.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Campaign {
  id: number;
  name: string;
  influencer: string;
  status: "pending" | "active" | "completed";
}

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Fetch campaigns from backend
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get<Campaign[]>("/api/campaigns");
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Campaign Management
      </h3>
      <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              {campaign.name} - {campaign.influencer} ({campaign.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CampaignManagement;