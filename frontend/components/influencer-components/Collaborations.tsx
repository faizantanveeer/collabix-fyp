"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { UserData } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

interface CollaborationRequest {
  _id: string;
  business: { name: string };
  budget: string;
  status: "pending" | "accepted" | "completed" | "rejected";
}

interface CollaborationsProps {
  userData: UserData | null;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const Collaborations = ({ userData }: CollaborationsProps) => {
  const userProfileId = userData?.profile?.id;

  const { data: requests, mutate, error } = useSWR<CollaborationRequest[]>(
    userProfileId ? `http://localhost:5000/collaboration/influencer/${userProfileId}` : null,
    fetcher
  );

  const handleUpdateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      const response = await fetch(`http://localhost:5000/collaboration/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      mutate((prev) =>
        prev ? prev.map((req) => (req._id === id ? { ...req, status } : req)) : []
      );

      toast.success(`Request ${status}!`);
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  if (!userProfileId) return <p className="text-center text-muted-foreground">No user profile found. Please log in.</p>;
  if (error) return <p className="text-red-500 text-center">Error fetching requests.</p>;
  if (!requests) return <div className="flex justify-center"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>;

  // Categorize requests
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const activeRequests = requests.filter((r) => r.status === "accepted");
  const completedRequests = requests.filter((r) => r.status === "completed");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-8">
      <h2 className="text-3xl font-bold text-center">Collaboration Requests</h2>

      {/* Pending Requests (Grid - 2 Columns) */}
      {pendingRequests.length > 0 && (
        <Section title="Pending Requests" gridClasses="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pendingRequests.map((request) => (
            <RequestCard key={request._id} request={request}>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" onClick={() => handleUpdateStatus(request._id, "accepted")}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Accept
                </Button>
                <Button variant="destructive" onClick={() => handleUpdateStatus(request._id, "rejected")}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </RequestCard>
          ))}
        </Section>
      )}

      {/* Active Requests (Grid - Responsive) */}
      {activeRequests.length > 0 && (
        <Section title="Active Collaborations" gridClasses="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRequests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </Section>
      )}

      {/* Completed Requests (List View - Full Width) */}
      {completedRequests.length > 0 && (
        <Section title="Completed Collaborations" gridClasses="space-y-4">
          {completedRequests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </Section>
      )}

      {/* Rejected Requests (Compact Grid - 4 Columns on Large Screens) */}
      {rejectedRequests.length > 0 && (
        <Section title="Rejected Requests" gridClasses="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rejectedRequests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </Section>
      )}
    </div>
  );
};

export default Collaborations;

// Section Component
const Section = ({ title, gridClasses, children }: { title: string; gridClasses: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">{title}</h3>
    <div className={gridClasses}>{children}</div>
  </div>
);

// Request Card Component
const RequestCard = ({ request, children }: { request: CollaborationRequest; children?: React.ReactNode }) => (
  <Card className="shadow-md border border-muted">
    <CardHeader>
      <CardTitle className="text-lg">{request.business.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        <strong>Budget:</strong> {request.budget}
      </p>
      <div className="flex items-center gap-2">
        <strong>Status:</strong>
        <Badge
          variant="outline"
          className={`${
            request.status === "accepted"
              ? "bg-green-100 text-green-700 border-green-500"
              : request.status === "rejected"
              ? "bg-red-100 text-red-700 border-red-500"
              : request.status === "completed"
              ? "bg-blue-100 text-blue-700 border-blue-500"
              : "bg-yellow-100 text-yellow-700 border-yellow-500"
          }`}
        >
          {request.status}
        </Badge>
      </div>
      {children}
    </CardContent>
  </Card>
);
