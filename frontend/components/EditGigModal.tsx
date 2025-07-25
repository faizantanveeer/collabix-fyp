import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import EditGigForm from './EditGigForm'; // your form component
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

const EditGigModal = ({
	gigId,
	onClose,
}: {
	gigId: string;
	onClose: () => void;
}) => {
	const [gig, setGig] = useState<any>(null);
	const { data: session } = useSession();
	const token = session?.accessToken || '';

	const fetchGig = async () => {
		const res = await fetch(`http://localhost:5000/gigs/${gigId}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await res.json();
		const fetchedGig = Array.isArray(data) ? data[0] : data;
		setGig(fetchedGig);
	};

	useEffect(() => {
		fetchGig();
	}, [gigId]);

	return (
		<Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="max-w-2xl max-h-[90vh] w-[95%] rounded-2xl overflow-hidden p-0">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle>Edit Gig</DialogTitle>
				</DialogHeader>
				<div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
					{gig ? (
						<EditGigForm gig={gig} onClose={onClose} onUpdated={fetchGig} />
					) : (
						<div className="flex items-center justify-center py-10">
							<Loader2 size={30} className="animate-spin" />
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditGigModal;
