// components/CreateGigForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gigFormSchema } from '@/schemas/gigSchema';
import { z } from 'zod';

import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

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
import { toast } from 'sonner';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

type GigFormValues = z.infer<typeof gigFormSchema>;

export default function CreateGigForm() {
	const { data: session } = useSession();

	const token = session?.accessToken || '';

	const form = useForm<GigFormValues>({
		resolver: zodResolver(gigFormSchema),
		defaultValues: {
			title: '',
			description: '',
			price: 0,
			deliveryTime: 1,
			revisions: 1,
			category: 'other',
			isActive: true,
			images: undefined,
		},
	});

	const onSubmit = async (data: GigFormValues) => {
		try {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				if (key === 'images') {
					Array.from(value as FileList).forEach((file) => {
						formData.append('images', file);
					});
				} else {
					formData.append(key, value as any);
				}
			});
            console.log('Form Data:', Object.fromEntries(formData.entries()));
			const res = await fetch('http://localhost:5000/gigs/create', {
				method: 'POST',
				body: formData,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: 'include',
			});

			console.log('Response:', res);

			if (!res.ok) throw new Error('Gig creation failed');
			toast.success('Gig created successfully!');
			form.reset();
		} catch (err) {
			toast.error('Something went wrong');
			console.error(err);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 max-w-xl mx-auto"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Gig Title" {...field} />
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
								<Textarea
									placeholder="Describe your gig..."
									{...field}
								/>
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
								<FormLabel>Price ($)</FormLabel>
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
									<SelectItem value="other">Other</SelectItem>
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
							<FormLabel>Images</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept="image/*"
									multiple
									onChange={(e) =>
										field.onChange(e.target.files)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full">
					Create Gig
				</Button>
			</form>
		</Form>
	);
}
