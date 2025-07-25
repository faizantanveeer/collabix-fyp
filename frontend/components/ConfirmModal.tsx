'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReactNode, useState } from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';

type ConfirmModalProps = {
	trigger: ReactNode;
	title: string;
	description: string;
	onConfirm?: () => void;
	isEdit?: boolean;
	openEditModal?: () => void;
};

export function ConfirmModal({
	trigger,
	title,
	description,
	onConfirm,
	isEdit = false,
	openEditModal,
}: ConfirmModalProps) {
	const [open, setOpen] = useState(false);

	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm(); // ✅ Fire confirm logic
		}
		setOpen(false); // ✅ Close after confirmation
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-medium">{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button variant="ghost" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						variant={isEdit ? 'default' : 'destructive'}
						onClick={handleConfirm}
					>
						{isEdit ? (
							<>
								<PencilIcon className="w-4 h-4" /> Edit
							</>
						) : (
							<>
								<TrashIcon className="w-4 h-4" /> Delete
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
