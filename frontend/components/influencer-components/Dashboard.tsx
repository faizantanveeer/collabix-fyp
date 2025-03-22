import { Session } from "next-auth";
import { UserData } from "../../types";
import useSWR from "swr";
import { Loader2, DollarSign, Users, Clock, CheckCircle, BarChart2, Settings, HelpCircle, List, Link } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
  userData: UserData | null;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const InfluencerDashboard = ({ userData }: DashboardProps) => {
  const userProfileId = userData?.profile?.id;

  const { data: collaborations, error } = useSWR<any[]>(
    userProfileId ? `http://localhost:5000/collaboration/influencer/${userProfileId}` : null,
    fetcher
  );

  if (!userProfileId) return <p className="text-center text-muted-foreground">No user profile found. Please log in.</p>;
  if (error) return <p className="text-red-500 text-center">Error fetching data.</p>;
  if (!collaborations) return <div className="flex justify-center"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>;

  // Calculate dashboard stats
  const totalEarnings = collaborations
    .filter(collab => collab.status === "completed")
    .reduce((sum, collab) => sum + parseInt(collab.budget), 0);

  const activeCollabs = collaborations.filter(collab => collab.status === "accepted").length;
  const pendingRequests = collaborations.filter(collab => collab.status === "pending").length;
  const completedCollabs = collaborations.filter(collab => collab.status === "completed").length;
  const rejectedCollabs = collaborations.filter(collab => collab.status === "rejected").length;
  const recentCollaborations = collaborations.slice(0, 5);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 mb-16"
    >
      {/* Stats Overview */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Total Earnings</h3>
          </div>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600"
          >
            {totalEarnings.toLocaleString()} PKR
          </motion.p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Active Collaborations</h3>
          </div>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {activeCollabs}
          </motion.p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold">Pending Requests</h3>
          </div>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600"
          >
            {pendingRequests}
          </motion.p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Completed Projects</h3>
          </div>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600"
          >
            {completedCollabs}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Additional Stats */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
      >
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.01 }}
          className="p-6 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Monthly Performance</h3>
          </div>
          <div className="mt-4 space-y-3">
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-gray-600 flex justify-between items-center"
            >
              <span>Average Project Value:</span>
              <span className="font-semibold">{(totalEarnings / completedCollabs || 0).toLocaleString()} PKR</span>
            </motion.p>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 flex justify-between items-center"
            >
              <span>Rejected Collaborations:</span>
              <span className="font-semibold">{rejectedCollabs}</span>
            </motion.p>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 flex justify-between items-center"
            >
              <span>Success Rate:</span>
              <span className="font-semibold">{((completedCollabs / (completedCollabs + rejectedCollabs)) * 100 || 0).toFixed(1)}%</span>
            </motion.p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.01 }}
          className="p-6 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="mt-4 space-y-3">
            
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgb(243 244 246)" }}
              
              className="w-full p-3 text-left rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
              <List className="w-5 h-5" />
              View All Collaborations
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgb(243 244 246)" }}
              className="w-full p-3 text-left rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Update Profile
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgb(243 244 246)" }}
              className="w-full p-3 text-left rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Collaborations */}
      <motion.div 
        variants={item}
        initial="hidden"
        animate="show"
        className="bg-white p-6 shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80"
      >
        <h3 className="text-xl font-semibold mb-6">Recent Collaborations</h3>
        {recentCollaborations.length > 0 ? (
          <motion.ul 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {recentCollaborations.map((collab, index) => (
              <motion.li 
                key={collab._id}
                variants={item}
                whileHover={{ scale: 1.01 }}
                className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:shadow-md transition-all duration-300"
              >
                <div>
                  <p className="text-lg font-semibold">{collab.business.name}</p>
                  <p className="text-gray-600">Budget: {collab.budget} PKR</p>
                  <p className="text-sm text-gray-500">{collab.campaign || "No campaign specified"}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-medium ${
                    collab.status === "pending" 
                      ? "bg-yellow-100 text-yellow-700" 
                      : collab.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : collab.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-center text-gray-500">No collaborations found</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InfluencerDashboard;