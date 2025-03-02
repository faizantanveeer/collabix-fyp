import Sidebar from "./Sidebar";

const DashboardContainer = ({ children, role }: { children: React.ReactNode; role: "business" | "influencer" }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <main className="flex-1 p-5">{children}</main>
    </div>
  );
};

export default DashboardContainer;
