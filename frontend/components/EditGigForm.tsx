'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGigSchema } from '@/schemas/gigSchema';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectTrigger,
	SelectItem,
	SelectValue,
	SelectContent,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

type GigFormValues = z.infer<typeof updateGigSchema>;

type EditGigFormProps = {
	gig: GigFormValues & { _id: string };
	onClose: () => void;
	onUpdated?: () => void;
};

export default function EditGigForm({
	gig,
	onClose,
	onUpdated,
}: EditGigFormProps) {
	const { data: session } = useSession();
	const token = session?.accessToken || '';
	const [newImage, setNewImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string>(
		gig.images[0] || ''
	);

	const form = useForm<GigFormValues>({
		resolver: zodResolver(updateGigSchema),
		defaultValues: {
			title: gig.title || '',
			description: gig.description || '',
			price: gig.price || 0,
			deliveryTime: gig.deliveryTime || 0,
			revisions: gig.revisions || 0,
			category: gig.category ?? undefined,
			isActive: gig.isActive || false,
			images: undefined,
		},
	});

	const [showConfirm, setShowConfirm] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setNewImage(file);
			setPreviewImage(URL.createObjectURL(file));
		}
	};

	const handleUpdate = async (data: GigFormValues) => {
		try {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				if (key === 'images' && value) {
					Array.from(value as FileList).forEach((file) =>
						formData.append('images', file)
					);
				} else if (value !== undefined && value !== null) {
					formData.append(key, String(value)); // Force strings to avoid NaN issues
				}
			});

			if (newImage) {
				formData.append('image', newImage);
			}

			if (!gig) {
				throw new Error('Gig data is not loaded');
			}

			const res = await fetch(`http://localhost:5000/gigs/${gig._id}`, {
				method: 'PUT',
				body: formData,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) throw new Error('Gig update failed');

			toast.success('Gig updated!');
			onClose();
		} catch (err) {
			toast.error('Failed to update gig');
			console.error(err);
		}
	};

	if (!gig) {
		return (
			<div className="flex items-center justify-center py-10">
				<Loader2 size={30} className="animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-6 overflow-auto">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(() => setShowConfirm(true))}
					className="space-y-6 max-w-xl mx-auto"
				>
					{/* Fields same as CreateGigForm */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="deliveryTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Delivery Time (days)</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="revisions"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Revisions</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="content creation">
											Content Creation
										</SelectItem>
										<SelectItem value="shoutout">
											Shoutout
										</SelectItem>
										<SelectItem value="review">
											Review
										</SelectItem>
										<SelectItem value="other">
											Other
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="isActive"
						render={({ field }) => (
							<FormItem className="flex items-center justify-between">
								<FormLabel>Is Active?</FormLabel>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Image (optional)</FormLabel>
								<FormControl>
									<Input
										type="file"
										accept="image/*"
										multiple
										onChange={(e) => {
											const file =
												e.target.files?.[0] || null;
											setNewImage(file);
											field.onChange(e.target.files);

											if (file) {
												const reader = new FileReader();
												reader.onloadend = () =>
													setPreviewImage(
														reader.result as string
													);
												reader.readAsDataURL(file);
											} else {
												setPreviewImage('');
											}
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Image
						src={
							previewImage?.startsWith('data:image') ||
							previewImage?.startsWith('http')
								? previewImage
								: `http://localhost:5000/uploads/${previewImage}`
						}
						alt="Gig Image"
						width={300}
						height={300}
						className="w-32 h-32 object-cover rounded-md"
					/>

					<Button type="submit" className="w-full">
						Update Gig
					</Button>
				</form>

				{/* ✅ Confirmation Dialog */}
				<AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirm Update</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to save these changes?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={form.handleSubmit(handleUpdate)}
							>
								Yes, Save
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</Form>
		</div>
	);
}
