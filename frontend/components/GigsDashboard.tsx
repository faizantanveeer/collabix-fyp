// components/GigsDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import GigCard from './GigCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Gig {
	_id: string;
	title: string;
	image: string;
	category: string;
	price: number;
	revisions: number;
	thumbnail: string;
}

export default function GigsDashboard() {
	const [gigs, setGigs] = useState<Gig[]>([]);
	const [loading, setLoading] = useState(true);
	const { data: session } = useSession();

	const token = session?.accessToken || '';

	useEffect(() => {
		if (!token) return;

		const fetchGigs = async () => {
			try {
				console.log('token:', token);

				const res = await fetch(
					'http://localhost:5000/gigs/influencer',
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
					}
				);

				if (!res.ok) {
					const errData = await res.json();
					throw new Error(errData.message || 'Fetch failed');
				}
				const data = await res.json();
				const gigsWithImage = data.gigs.map((gig: any) => ({
					...gig,
					image: gig.image || gig.images?.[0] || '',
				}));
				console.log('Fetched gigs:', gigsWithImage);
				setGigs(gigsWithImage);
			} catch (err) {
				console.error('Failed to fetch gigs:', err);

			} finally {
				setLoading(false);
			}
		};

		fetchGigs();
	}, [token]);

	const handleEdit = (id: string) => {};

	const handleDelete = async (id: string) => {
		if (!token) return;

		try {
			const res = await fetch(`http://localhost:5000/gigs/delete/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!res.ok) {
				const errData = await res.json();
				throw new Error(errData.message || 'Delete failed');
			}

			toast.success('Gig deleted successfully');

			setGigs((prevGigs) => prevGigs.filter((gig) => gig._id !== id));
		} catch (err) {
			console.error('Failed to delete gig:', err);
			toast.error('Failed to delete gig');
		}
	};

	if (loading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, idx) => (
					<Skeleton key={idx} className="h-48 w-full rounded-xl" />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-medium text-gray-900">
				Manage Your Gigs
			</h1>

			{gigs.length === 0 ? (
				<>
					<div className="flex flex-col items-center justify-center py-12 text-center ">
						<h2 className="text-3xl mb-2 text-gray-900">
							Oops! No gigs found
						</h2>
						<p className="text-zinc-400 mb-4">
							Create your first gig and shine.
						</p>
						<Button
							variant={'default'}
							onClick={() => (window.location.href = '/gigs/new')}
							className="px-4 py-2 text-gray-900  border border-gray-900 hover:bg-gray-900 hover:text-white rounded-xl transition duration-200"
						>
							Create Gig
						</Button>
					</div>
				</>
			) : (
				<>
					<div className="gap-6">
						<motion.div
							initial="initial"
							animate="animate"
							variants={{
								initial: {},
								animate: {
									transition: { staggerChildren: 0.1 },
								},
							}}
							className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 "
						>
							{gigs.map((gig) => (
								<GigCard
									key={gig._id}
									gig={gig}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							))}
						</motion.div>
					</div>
				</>
			)}
		</div>
	);
}
