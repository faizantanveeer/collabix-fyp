'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';
import Footer from './Footer';

type Gig = {
	_id: string;
	title: string;
	description?: string;
	images: string[];
	price: number;
	influencer: {
		_id: string; // Add influencer ID
		name: string;
		profileImage: string;
	};
};

const ExploreGigsPage = () => {
	const [gigs, setGigs] = useState<Gig[]>([]);
	const router = useRouter(); // Initialize useRouter

	const fetchGigs = async () => {
		try {
			const res = await fetch('http://localhost:5000/gigs/all');
			const data = await res.json();
			setGigs(data);
		} catch (error) {
			console.error('Error fetching gigs:', error);
		}
	};

	useEffect(() => {
		fetchGigs();
	}, []);

	// Handle card click
	const handleCardClick = (gigId: string) => {
		router.push(`http://localhost:3000/explore_gigs/${gigId}`);
	};

	// Handle influencer name click
	const handleInfluencerClick = (
		influencerId: string,
		event: React.MouseEvent
	) => {
		event.stopPropagation(); // Prevent the card's onClick from firing
		router.push(`http://localhost:3000/influencer/${influencerId}`);
	};

	return (
		<>
			<div className="p-4  my-16">
				<h1 className="text-4xl font-font text-gray-900 mb-8 text-center">
					Explore Gigs
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{gigs.map((gig) => (
						<Card
							key={gig._id}
							className="border border-zinc-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] flex flex-col h-full"
							onClick={() => handleCardClick(gig._id)} // Make the whole card clickable
						>
							{/* Gig Image - Dynamic Sizing */}
							<div
								className="w-full relative overflow-hidden rounded-xl mb-4"
								style={{ paddingBottom: '75%' }}
							>
								<Image
									src={
										gig.images && gig.images.length > 0
											? gig.images[0].startsWith('http')
												? gig.images[0]
												: gig.images[0].startsWith(
														'/images/'
												  )
												? gig.images[0]
												: `http://localhost:5000/uploads/${gig.images[0]}`
											: '/images/gig_image.png'
									}
									alt={gig.title}
									fill
									style={{ objectFit: 'cover' }}
									className="rounded-xl"
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>
							</div>

							<CardContent className="p-0 text-left w-full flex flex-col flex-grow">
								<div className="flex items-center gap-3 mb-3">
									{/* Influencer Profile Image - Dynamic Sizing */}
									<div className="relative h-10 w-10 flex-shrink-0">
										<Image
											src={
												gig.influencer.profileImage
													? gig.influencer.profileImage.startsWith(
															'http'
													  )
														? gig.influencer
																.profileImage
														: gig.influencer.profileImage.startsWith(
																'/images/'
														  )
														? gig.influencer
																.profileImage
														: `http://localhost:5000/uploads/profiles/${gig.influencer.profileImage}`
													: '/images/placeholder.png'
											}
											alt={
												gig.influencer.name ||
												'Influencer Profile'
											}
											fill
											style={{ objectFit: 'cover' }}
											className="rounded-full border border-gray-200"
											sizes="40px"
										/>
									</div>
									<div className="flex-grow">
										<h2 className="text-lg font-semibold text-gray-900 leading-tight">
											{gig.title}
										</h2>
										<p className="text-sm text-gray-700 mt-0.5">
											By{' '}
											<span
												className="font-medium text-gray-800 hover:underline cursor-pointer" // Underline on hover, cursor pointer
												onClick={(event) =>
													handleInfluencerClick(
														gig.influencer._id,
														event
													)
												} // Make influencer name clickable
											>
												{gig.influencer.name}
											</span>
										</p>
									</div>
								</div>
								<p className="text-sm text-gray-600 mb-4 flex-grow">
									{gig.description?.slice(0, 90)}
									{gig.description &&
									gig.description.length > 90
										? '...'
										: ''}
								</p>
								<div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-200">
									<span className="text-xl font-bold text-gray-900">
										Rs.{gig.price}
									</span>
									{/* The original "View Details" link for explicit navigation */}
									<Link
										href={`/explore_gigs/${gig._id}`}
										className="text-gray-600 hover:text-gray-800 text-sm font-semibold transition-colors flex items-center gap-1"
										onClick={(e) => e.stopPropagation()} // Prevent card click when clicking this link
									>
										View Details{' '}
										<span aria-hidden="true">&rarr;</span>
									</Link>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
			
		</>
	);
};

export default ExploreGigsPage;
