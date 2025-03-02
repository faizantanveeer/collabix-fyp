import { UserData } from "../../types";

interface CollaborationsProps {
  userData: UserData | null;
}

const Collaborations = ({ userData }: CollaborationsProps) => {
  return <h1 className="text-2xl font-bold">Manage Your Collaborations</h1>;
};

export default Collaborations;
  