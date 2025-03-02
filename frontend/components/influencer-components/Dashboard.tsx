import { Session } from "next-auth";
import { UserData } from "../../types";

interface DashboardProps {
  userData: UserData | null;
}

const InfluencerDashboard = ({ userData }: DashboardProps) => {
  const stats = {
    totalEarnings: "$4,750",
    activeCollabs: 8,
    pendingRequests: 3,
    completedCollabs: 15,
    engagementRate: "82%",
  };

  const collabRequests = [
    { brand: "Nike", offer: "$500", status: "Pending" },
    { brand: "Adidas", offer: "$700", status: "Pending" },
    { brand: "Puma", offer: "$300", status: "Accepted" },
  ];

  return (
    <div className="p-6 bg-gray-100">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold">💰 Total Earnings</h3>
          <p className="text-2xl font-bold">{stats.totalEarnings}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold">🤝 Active Collaborations</h3>
          <p className="text-2xl font-bold">{stats.activeCollabs}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold">📈 Engagement Rate</h3>
          <p className="text-2xl font-bold">{stats.engagementRate}</p>
        </div>
      </div>

      {/* Collaboration Requests */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-4">📌 New Collaboration Requests</h3>
        <ul>
          {collabRequests.map((collab, index) => (
            <li key={index} className="p-3 border-b flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{collab.brand}</p>
                <p className="text-gray-600">Offer: {collab.offer}</p>
              </div>
              <span
                className={`px-3 py-1 rounded ${
                  collab.status === "Pending" ? "bg-yellow-300" : "bg-green-300"
                }`}
              >
                {collab.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
  
   