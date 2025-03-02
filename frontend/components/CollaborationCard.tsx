import { Collaboration } from "../types"; // Define TypeScript types

const CollaborationCard = ({ collaboration }: { collaboration: Collaboration }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-md shadow-md bg-white">
      <h3 className="text-lg font-bold">{collaboration.campaign}</h3>
      <p>Status: <span className="font-semibold">{collaboration.status}</span></p>
      <p>Budget: <span className="font-semibold">${collaboration.budget}</span></p>
    </div>
  );
};

export default CollaborationCard;
