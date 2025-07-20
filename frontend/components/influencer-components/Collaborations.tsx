'use client';

import useSWRImmutable from 'swr/immutable';
import { toast } from 'sonner';
import { UserData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, XCircle, CheckCircle, Trash2, Filter } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';

interface CollaborationRequest {
	_id: string;
	business: { name: string };
	budget: string;
	status: 'pending' | 'accepted' | 'completed' | 'rejected';
	description?: string;
	deliverables?: string;
	deadline?: string;
	campaign?: string;
	file?: string;
}

interface CollaborationsProps {
	userData: UserData | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Collaborations = ({ userData }: CollaborationsProps) => {
	const userProfileId = userData?.profile?.id;
	const [selectedRequest, setSelectedRequest] =
		useState<CollaborationRequest | null>(null);
	const [activeFilter, setActiveFilter] = useState<
		'all' | 'pending' | 'accepted' | 'completed' | 'rejected'
	>('all');

	const shouldFetch = !!userProfileId;
	const {
		data: requestData,
		error: fetchError,
		isLoading: isFetching,
		mutate,
	} = useSWRImmutable<CollaborationRequest[]>(
		shouldFetch
			? `http://localhost:5000/collaboration/influencer/${userProfileId}`
			: null,
		fetcher
	);

	const handleUpdateStatus = async (
		id: string,
		status: 'accepted' | 'rejected'
	) => {
		try {
			const response = await fetch(
				`http://localhost:5000/collaboration/${id}/status`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ status }),
				}
			);

			if (!response.ok) throw new Error('Failed to update status');

			mutate(); // re-fetch updated data
			toast.success(`Request ${status}!`);
		} catch (error) {
			toast.error('Error updating status');
		}
	};

	const handleDelete = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();

		try {
			const response = await fetch(
				`http://localhost:5000/collaboration/${id}/delete`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) throw new Error('Failed to delete request');

			mutate(); // re-fetch updated data
			toast.success('Request deleted successfully');
		} catch (error) {
			toast.error('Error deleting request');
		}
	};

	// UI Handling
	if (!userProfileId)
		return (
			<p className="text-center text-muted-foreground">
				No user profile found. Please log in.
			</p>
		);

	if (isFetching)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<PulseLoader color="#111827" size={10} speedMultiplier={0.6} />
			</div>
		);

	if (fetchError)
		return (
			<p className="text-red-500 text-center">
				Error fetching requests: {fetchError.message}
			</p>
		);

	if (!requestData || requestData.length === 0)
		return (
			<p className="text-center text-muted-foreground">
				No collaboration requests yet.
			</p>
		);

	// Categorize requests
	const pendingRequests = requestData.filter((r) => r.status === 'pending');
	const activeRequests = requestData.filter((r) => r.status === 'accepted');
	const completedRequests = requestData.filter(
		(r) => r.status === 'completed'
	);
	const rejectedRequests = requestData.filter((r) => r.status === 'rejected');

	return (
		<div className="max-w-6xl mx-auto mt-4 mb-14 pb-8 space-y-8">
			<div className="flex flex-col items-center gap-4">
				<h2 className="text-3xl font-bold text-center">
					Collaboration Requests
				</h2>

				<div className="flex gap-2">
					<Button
						variant={activeFilter === 'all' ? 'default' : 'outline'}
						onClick={() => setActiveFilter('all')}
						size="sm"
					>
						All
					</Button>
					<Button
						variant={
							activeFilter === 'pending' ? 'default' : 'outline'
						}
						onClick={() => setActiveFilter('pending')}
						size="sm"
						className="bg-yellow-100 text-yellow-700 border-yellow-500 hover:bg-yellow-200"
					>
						Pending ({pendingRequests.length})
					</Button>
					<Button
						variant={
							activeFilter === 'accepted' ? 'default' : 'outline'
						}
						onClick={() => setActiveFilter('accepted')}
						size="sm"
						className="bg-green-100 text-green-700 border-green-500 hover:bg-green-200"
					>
						Active ({activeRequests.length})
					</Button>
					<Button
						variant={
							activeFilter === 'completed' ? 'default' : 'outline'
						}
						onClick={() => setActiveFilter('completed')}
						size="sm"
						className="bg-blue-100 text-blue-700 border-blue-500 hover:bg-blue-200"
					>
						Completed ({completedRequests.length})
					</Button>
					<Button
						variant={
							activeFilter === 'rejected' ? 'default' : 'outline'
						}
						onClick={() => setActiveFilter('rejected')}
						size="sm"
						className="bg-red-100 text-red-700 border-red-500 hover:bg-red-200"
					>
						Rejected ({rejectedRequests.length})
					</Button>
				</div>
			</div>

			{/* Pending Requests (Grid - 2 Columns) */}
			{(activeFilter === 'all' || activeFilter === 'pending') &&
				pendingRequests.length > 0 && (
					<Section
						title={`Pending Requests (${pendingRequests.length})`}
						gridClasses="grid grid-cols-1 sm:grid-cols-2 gap-6"
					>
						{pendingRequests.map((request) => (
							<RequestCard
								key={request._id}
								request={request}
								onDelete={handleDelete}
								onSelect={setSelectedRequest}
							/>
						))}
					</Section>
				)}

			{/* Active Requests (Grid - Responsive) */}
			{(activeFilter === 'all' || activeFilter === 'accepted') &&
				activeRequests.length > 0 && (
					<Section
						title={`Active Collaborations (${activeRequests.length})`}
						gridClasses="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{activeRequests.map((request) => (
							<RequestCard
								key={request._id}
								request={request}
								onDelete={handleDelete}
								onSelect={setSelectedRequest}
							/>
						))}
					</Section>
				)}

			{/* Completed Requests (List View - Full Width) */}
			{(activeFilter === 'all' || activeFilter === 'completed') &&
				completedRequests.length > 0 && (
					<Section
						title={`Completed Collaborations (${completedRequests.length})`}
						gridClasses="space-y-4"
					>
						{completedRequests.map((request) => (
							<RequestCard
								key={request._id}
								request={request}
								onDelete={handleDelete}
								onSelect={setSelectedRequest}
							/>
						))}
					</Section>
				)}

			{/* Rejected Requests (Compact Grid - 4 Columns on Large Screens) */}
			{(activeFilter === 'all' || activeFilter === 'rejected') &&
				rejectedRequests.length > 0 && (
					<Section
						title={`Rejected Requests (${rejectedRequests.length})`}
						gridClasses="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
					>
						{rejectedRequests.map((request) => (
							<RequestCard
								key={request._id}
								request={request}
								onDelete={handleDelete}
								onSelect={setSelectedRequest}
							/>
						))}
					</Section>
				)}

			{/* Modal */}
			<Dialog
				open={!!selectedRequest}
				onOpenChange={() => setSelectedRequest(null)}
			>
				<DialogContent className="w-full max-w-md bg-white shadow-lg rounded-md overflow-hidden">
					<div className="max-h-[70vh] overflow-auto px-4 py-2">
						<DialogHeader>
							<DialogTitle>Collaboration Details</DialogTitle>
							<DialogDescription>
								From {selectedRequest?.business.name}
							</DialogDescription>
						</DialogHeader>

						{/* Image Preview (If Available) */}
						{selectedRequest?.campaign && (
							<div className="flex justify-center mb-4">
								<div className="max-h-60 overflow-auto border rounded-md shadow-lg">
									<img
										src={`http://localhost:5000/${selectedRequest.file}`}
										alt="Campaign Image"
										className="w-full object-cover"
									/>
								</div>
							</div>
						)}

						<div className="space-y-4 mt-4">
							<div>
								<h4 className="font-semibold">Campaign Type</h4>
								<p className="text-sm text-gray-600">
									{selectedRequest?.campaign}
								</p>
							</div>
							<div>
								<h4 className="font-semibold">Budget</h4>
								<p className="text-sm text-gray-600">
									{selectedRequest?.budget} PKR
								</p>
							</div>
							<div>
								<h4 className="font-semibold">Description</h4>
								<p className="text-sm text-gray-600">
									{selectedRequest?.description ||
										'No description provided'}
								</p>
							</div>
							<div>
								<h4 className="font-semibold">Deliverables</h4>
								<p className="text-sm text-gray-600">
									{selectedRequest?.deliverables ||
										'No deliverables specified'}
								</p>
							</div>
							<div>
								<h4 className="font-semibold">Deadline</h4>
								<p className="text-sm text-gray-600">
									{selectedRequest?.deadline ||
										'No deadline specified'}
								</p>
							</div>
						</div>
					</div>

					{/* Accept & Reject Buttons (Now Move with Scroll) */}
					{selectedRequest?.status === 'pending' && (
						<div className="px-4 py-3 flex gap-2 border-t bg-white">
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => {
									handleUpdateStatus(
										selectedRequest._id,
										'accepted'
									);
									setSelectedRequest(null);
								}}
							>
								<CheckCircle className="w-4 h-4 mr-2" /> Accept
							</Button>
							<Button
								variant="destructive"
								className="flex-1"
								onClick={() => {
									handleUpdateStatus(
										selectedRequest._id,
										'rejected'
									);
									setSelectedRequest(null);
								}}
							>
								<XCircle className="w-4 h-4 mr-2" /> Reject
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Collaborations;

// Section Component
const Section = ({
	title,
	gridClasses,
	children,
}: {
	title: string;
	gridClasses: string;
	children: React.ReactNode;
}) => (
	<div>
		<h3 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">
			{title}
		</h3>
		<div className={gridClasses}>{children}</div>
	</div>
);

// Update the RequestCard props interface
interface RequestCardProps {
	request: CollaborationRequest;
	onDelete: (id: string, e: React.MouseEvent) => void;
	onSelect: (request: CollaborationRequest) => void;
}

// Update the RequestCard component
const RequestCard = ({ request, onDelete, onSelect }: RequestCardProps) => (
	<Card className="shadow-md border border-muted relative group transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
		<button
			onClick={(e) => onDelete(request._id, e)}
			className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
		>
			<Trash2 size={18} />
		</button>
		<div
			className="cursor-pointer relative"
			onClick={() => onSelect(request)}
		>
			<div className="absolute inset-0 backdrop-blur-sm bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-lg">
				<span className="text-sm font-semibold text-white bg-black/20 px-4 py-2 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
					Click to view details
				</span>
			</div>
			<CardHeader>
				<CardTitle className="text-lg">
					{request.business.name}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<p className="text-sm text-muted-foreground">
					<strong>Budget:</strong> {request.budget} PKR
				</p>
				<div className="flex items-center gap-2">
					<strong>Status:</strong>
					<Badge
						variant="outline"
						className={`${
							request.status === 'accepted'
								? 'bg-green-100 text-green-700 border-green-500'
								: request.status === 'rejected'
								? 'bg-red-100 text-red-700 border-red-500'
								: request.status === 'completed'
								? 'bg-blue-100 text-blue-700 border-blue-500'
								: 'bg-yellow-100 text-yellow-700 border-yellow-500'
						}`}
					>
						{request.status}
					</Badge>
				</div>
			</CardContent>
		</div>
	</Card>
);
