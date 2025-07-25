import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useState } from 'react';
import EditGigForm from './EditGigForm';
import EditGigModal from './EditGigModal';

const item = {
	initial: { opacity: 0, y: 30 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type Gig = {
	_id: string;
	title: string;
	image: string;
	category: string;
	price: number;
	revisions: number;
};

type GigCardProps = {
	gig: Gig;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
};

const GigCard = ({ gig, onEdit, onDelete }: GigCardProps) => {
	const [editGigId, setEditGigId] = useState<string | null>(null);

	const openEditModal = (gigId: string) => {
		setEditGigId(gigId);
	};

	const closeEditModal = () => {
		setEditGigId(null);
		window.location.reload();
	};

	return (
		<>
			<Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white rounded-2xl shadow-md hover:shadow-xl border border-zinc-200 transition-all duration-300  hover:scale-100 hover:cursor-pointer">
				<CardHeader className="p-0">
					<Image
						src={
							gig.image
								? gig.image.startsWith('http')
									? gig.image // ✅ External image URL
									: gig.image.startsWith('/images/')
									? gig.image // ✅ Static local image
									: `http://localhost:5000/uploads/${gig.image}` // ✅ Uploaded image
								: '/images/placeholder.png' // ✅ Fallback
						}
						alt={gig.title}
						className="h-44 w-full object-cover rounded-t-2xl"
						width={500}
						height={300}
					/>
				</CardHeader>

				<CardContent className="p-5 space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold truncate">
							{gig.title}
						</h3>
						<Badge
							variant="outline"
							className="text-xs px-2 py-1 rounded-full"
						>
							{gig.category}
						</Badge>
					</div>

					<div className="text-sm text-zinc-600 flex justify-between">
						<span className="font-medium">PKR {gig.price}</span>
						<span className="text-xs">
							Revisions: {gig.revisions}
						</span>
					</div>

					<div className="flex justify-between pt-1">
						<ConfirmModal
							trigger={
								<Button
									variant="outline"
									size="sm"
									className="gap-1 text-sm"
								>
									<PencilIcon className="w-4 h-4" />
									Edit
								</Button>
							}
							isEdit
							title="Proceed to Edit?"
							description="Do you want to edit this gig?"
							onConfirm={() => openEditModal(gig._id)}
						/>

						<ConfirmModal
							trigger={
								<Button
									variant="ghost"
									size="sm"
									className="gap-1 text-sm text-red-500 hover:text-red-500 border-red-500"
								>
									<TrashIcon className="w-4 h-4" />
								</Button>
							}
							title="Are you sure?"
							description="This process is irreversible. Do you want to delete this gig?"
							onConfirm={() => onDelete(gig._id)}
						/>
					</div>

					{/* Render EditGigForm Modal */}
					{editGigId && (
						<EditGigModal
							gigId={editGigId}
							onClose={closeEditModal}
						/>
					)}
				</CardContent>
			</Card>
		</>
	);
};

export default GigCard;
