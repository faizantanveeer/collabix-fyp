import React, { useState, useEffect } from "react";
import { HandThumbUpIcon, HandThumbDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Collaboration {
  id: number;
  business: string;
  campaign: string;
  status: "pending" | "accepted" | "declined" | "completed";
  details?: {
    description: string;
    deliverables: string;
    budget: number;
  };
}

const CollaborationManagement = () => {
  const [collaborations, setCollaborations] = useState<{
    pending: Collaboration[];
    active: Collaboration[];
    completed: Collaboration[];
  }>({
    pending: [],
    active: [],
    completed: [],
  });
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);

  // Fetch collaborations from backend
  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await axios.get<{
          pending: Collaboration[];
          active: Collaboration[];
          completed: Collaboration[];
        }>("/api/collaborations");
        setCollaborations(response.data);
      } catch (error) {
        console.error("Error fetching collaborations:", error);
      }
    };
    fetchCollaborations();
  }, []);

  // Accept collaboration
  const handleAcceptCollaboration = async (collaborationId: number) => {
    try {
      await axios.post(`/api/collaborations/${collaborationId}/accept`);
      toast.success("Collaboration accepted!");
      // Refresh collaborations
      const response = await axios.get<{
        pending: Collaboration[];
        active: Collaboration[];
        completed: Collaboration[];
      }>("/api/collaborations");
      setCollaborations(response.data);
    } catch (error) {
      console.error("Error accepting collaboration:", error);
      toast.error("Failed to accept collaboration.");
    }
  };

  // Reject collaboration
  const handleRejectCollaboration = async (collaborationId: number) => {
    try {
      await axios.post(`/api/collaborations/${collaborationId}/reject`);
      toast.success("Collaboration rejected!");
      // Refresh collaborations
      const response = await axios.get<{
        pending: Collaboration[];
        active: Collaboration[];
        completed: Collaboration[];
      }>("/api/collaborations");
      setCollaborations(response.data);
    } catch (error) {
      console.error("Error rejecting collaboration:", error);
      toast.error("Failed to reject collaboration.");
    }
  };

  // Open collaboration details modal
  const openDetailsModal = (collaboration: Collaboration) => {
    setSelectedCollaboration(collaboration);
  };

  // Close collaboration details modal
  const closeDetailsModal = () => {
    setSelectedCollaboration(null);
  };

  return (
    <div className="mt-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <HandThumbUpIcon className="h-6 w-6 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Collaboration Management
        </h3>
      </div>
      <div className="mt-3 space-y-4">
        {/* Pending Collaborations */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Pending Requests
          </h4>
          <ul className="space-y-2">
            {collaborations.pending.map((collab) => (
              <li
                key={collab.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span>
                  {collab.business} - {collab.campaign}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptCollaboration(collab.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectCollaboration(collab.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => openDetailsModal(collab)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Active Collaborations */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Active Collaborations
          </h4>
          <ul className="space-y-2">
            {collaborations.active.map((collab) => (
              <li
                key={collab.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span>
                  {collab.business} - {collab.campaign}
                </span>
                <button
                  onClick={() => openDetailsModal(collab)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Completed Collaborations */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Completed Collaborations
          </h4>
          <ul className="space-y-2">
            {collaborations.completed.map((collab) => (
              <li
                key={collab.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span>
                  {collab.business} - {collab.campaign}
                </span>
                <button
                  onClick={() => openDetailsModal(collab)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Collaboration Details Modal */}
      {selectedCollaboration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Collaboration Details
            </h3>
            <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Business:</strong> {selectedCollaboration.business}</p>
              <p><strong>Campaign:</strong> {selectedCollaboration.campaign}</p>
              <p><strong>Status:</strong> {selectedCollaboration.status}</p>
              {selectedCollaboration.details && (
                <>
                  <p><strong>Description:</strong> {selectedCollaboration.details.description}</p>
                  <p><strong>Deliverables:</strong> {selectedCollaboration.details.deliverables}</p>
                  <p><strong>Budget:</strong> ${selectedCollaboration.details.budget}</p>
                </>
              )}
            </div>
            <button
              onClick={closeDetailsModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationManagement;