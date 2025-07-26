'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link'; // Import Link for navigation to influencer profile
import { PulseLoader } from 'react-spinners';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ContactRound, UserRound } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from '@/components/ui/carousel';
import ShortFooter from '@/components/ShortFooter';

// Re-defining Gig type for clarity in this component, ensure it matches your backend response
type Gig = {
	_id: string;
	title: string;
	description?: string;
	images: string[]; // It's an array, so we'll take the first one
	price: number;
	deliveryTime?: number; // Added as it's in your schema
	revisions?: number; // Added as it's in your schema
	category?: string; // Added as it's in your schema
	isActive?: boolean; // Added as it's in your schema
	influencer: {
		_id: string; // Influencer ID for linking
		name: string;
		profileImage: string;
		// Potentially add other influencer details you want to show, e.g., totalFollowers, averageRating
	};
};

const SingleGigPage = () => {
	const { id } = useParams();
	const [gig, setGig] = useState<Gig | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// New state for more gigs from the same influencer
	const [otherGigs, setOtherGigs] = useState<Gig[]>([]);
	const [otherGigsLoading, setOtherGigsLoading] = useState(false);
	const [otherGigsError, setOtherGigsError] = useState<string | null>(null);

	// Effect for fetching the main gig details
	useEffect(() => {
		const fetchGig = async () => {
			if (!id) return; // Ensure ID is available before fetching

			setLoading(true);
			setError(null);
			try {
				const res = await fetch(
					`http://localhost:5000/gigs/explore_gigs/${id}`
				);

				if (!res.ok) {
					throw new Error(
						`Failed to fetch gig: ${res.status} ${res.statusText}`
					);
				}
				const data = await res.json();

				// Backend should ideally return a single object for /gigs/explore_gigs/:id
				if (data && typeof data === 'object' && !Array.isArray(data)) {
					setGig(data as Gig);
				} else if (Array.isArray(data) && data.length > 0) {
					// Fallback if backend still sends an array for a single ID
					setGig(data[0] as Gig);
				} else {
					setGig(null);
					setError('Gig data not found or in unexpected format.');
				}
			} catch (err) {
				console.error('Error fetching gig details:', err);
				setError(
					err instanceof Error
						? err.message
						: 'An unknown error occurred while fetching gig details.'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchGig();
	}, [id]);

	// New Effect for fetching more gigs by the same influencer
	useEffect(() => {
		const fetchOtherGigs = async () => {
			if (!gig || !gig.influencer?._id) return; // Only fetch if main gig and influencer ID are available

			setOtherGigsLoading(true);
			setOtherGigsError(null);
			try {
				// Assuming your backend supports filtering by influencerId
				const res = await fetch(
					`http://localhost:5000/gigs/explore_gigs?influencerId=${gig.influencer._id}`
				);

				if (!res.ok) {
					throw new Error(
						`Failed to fetch other gigs: ${res.status} ${res.statusText}`
					);
				}
				const data = await res.json();

				if (Array.isArray(data)) {
					// Filter out the current gig from the list
					const filteredGigs = data.filter(
						(otherGig: Gig) => otherGig._id !== gig._id
					);
					setOtherGigs(filteredGigs as Gig[]);
					
				} else {
					setOtherGigs([]); // No other gigs or unexpected format
				}
			} catch (err) {
				console.error('Error fetching other gigs:', err);
				setOtherGigsError(
					err instanceof Error
						? err.message
						: 'An unknown error occurred while fetching other gigs.'
				);
			} finally {
				setOtherGigsLoading(false);
			}
		};

		fetchOtherGigs();
	}, [gig]); // Re-run this effect when the main gig data changes

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<PulseLoader color="#111827" size={10} speedMultiplier={0.6} />
			</div>
		);

	if (error)
		return (
			<div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
				<p className="text-xl text-red-500">Error: {error}</p>
			</div>
		);

	if (!gig)
		return (
			<div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
				<p className="text-xl text-gray-700">Gig not found.</p>
			</div>
		);

	// Determine the correct image URL for the main gig image
	const mainImageUrl =
		gig.images && gig.images.length > 0
			? gig.images[0].startsWith('http') ||
			  gig.images[0].startsWith('/images/')
				? gig.images[0]
				: `http://localhost:5000/uploads/${gig.images[0]}`
			: '/images/gig_image.png'; // Fallback image

	// Determine the correct image URL for the influencer profile image
	const profileImageUrl =
		gig.influencer.profileImage?.startsWith('http') ||
		gig.influencer.profileImage?.startsWith('/images/')
			? gig.influencer.profileImage
			: `http://localhost:5000/uploads/profiles/${
					gig.influencer.profileImage || 'default_profile.png'
			  }`; // Fallback for profile image

	return (
		<>
			<Navbar theme="light" />
			<div className="p-6 mt-20 max-w-5xl mx-auto border bg-white shadow-lg rounded-xl">
				{/* Main Gig Image */}
				<div className="relative w-full h-96 rounded-xl overflow-hidden mb-6">
					<Image
						src={mainImageUrl}
						alt={gig.title}
						fill
						style={{ objectFit: 'cover' }}
						className="rounded-xl"
						priority // Load this image with high priority
					/>
				</div>

				<div className="flex justify-between items-start mb-4">
					<h1 className="text-4xl font-bold text-gray-900 flex-1 pr-4">
						{gig.title}
					</h1>
					<h1 className="text-3xl text-gray-900 font-bold flex-shrink-0">
						Rs. {gig.price.toLocaleString()} {/* Format price */}
					</h1>
				</div>

				<p className="text-lg text-gray-700 font-bold underline mb-2">
					Description
				</p>
				<p className="text-lg text-gray-700 leading-relaxed mb-6">
					{gig.description}
				</p>

				{/* Influencer Information */}
				<div className="flex gap-4 mb-8 py-10 border-t flex-col border-b border-gray-200 ">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 ">
							About Influencer
						</h1>
					</div>
					<div className="flex justify-between items-center gap-4">
						<div className="flex items-center gap-4">
							<Link
								href={`/influencer/${gig.influencer._id}`}
								passHref
							>
								<div className="relative h-16 w-16 rounded-full  cursor-pointer border border-gray-300">
									<Image
										src={profileImageUrl}
										alt={gig.influencer.name}
										width={200} // Set explicit width and height for Image component
										height={200}
										className="rounded-full object-cover  h-16 w-16"
									/>
								</div>
							</Link>
							<div>
								<Link
									href={`/influencer/${gig.influencer._id}`}
									passHref
								>
									<h2 className="text-2xl font-semibold text-gray-900 hover:underline cursor-pointer">
										{gig.influencer.name}
									</h2>
								</Link>
							</div>
						</div>
						<Link
							href={`/influencer/${gig.influencer._id}`}
							passHref
						>
							<Button className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors">
								<UserRound /> Visit Profile
							</Button>
						</Link>
					</div>
				</div>

				{/* More Gigs by This Influencer Section */}
				{otherGigsLoading && (
					<div className="flex items-center justify-center py-8">
						<PulseLoader
							color="#111827"
							size={8}
							speedMultiplier={0.6}
						/>
						<p className="ml-2 text-gray-600">
							Loading other gigs...
						</p>
					</div>
				)}
				{otherGigsError && (
					<div className="text-red-500 text-center py-8">
						Error loading other gigs: {otherGigsError}
					</div>
				)}
				{!otherGigsLoading &&
					!otherGigsError &&
					otherGigs.length > 0 && (
						<div className="mt-8">
							<h2 className="text-3xl font-bold text-gray-900 mb-6  pb-2">
								More Gigs by {gig.influencer.name}
							</h2>
							{/* Shadcn Carousel Integration */}
							<Carousel
								opts={{
									align: 'start', // Align items to the start of the carousel
								}}
								className="w-full" // Take full width
							>
								<CarouselContent className="-ml-6">
									{' '}
									{/* Negative margin to counteract padding from CarouselItem */}
									{otherGigs.map((otherGig) => {
										const otherGigImageUrl =
											otherGig.images &&
											otherGig.images.length > 0
												? otherGig.images[0].startsWith(
														'http'
												  ) ||
												  otherGig.images[0].startsWith(
														'/images/'
												  )
													? otherGig.images[0]
													: `http://localhost:5000/uploads/${otherGig.images[0]}`
												: '/images/gig_image.png';

										return (
											<CarouselItem
												key={otherGig._id}
												className="pl-6 md:basis-1/2 lg:basis-1/3"
											>
												<Link
													href={`/gigs/${otherGig._id}`}
													passHref
												>
													<div className="p-1">
														{' '}
														{/* Small padding to ensure shadow visibility */}
														<div className="w-full border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
															<div className="relative w-full h-40 rounded-t-lg overflow-hidden mb-3">
																{' '}
																{/* Use rounded-t-lg for top corners of image */}
																<Image
																	src={
																		otherGigImageUrl
																	}
																	alt={
																		otherGig.title
																	}
																	fill
																	sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
																	style={{
																		objectFit:
																			'cover',
																	}}
																	className="rounded-t-md" // Apply border-radius to image top corners
																/>
															</div>
															<div className="p-4">
																{' '}
																{/* Padding for text content */}
																<h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
																	{
																		otherGig.title
																	}
																</h3>
																<p className="text-md font-bold text-gray-800">
																	Rs.{' '}
																	{otherGig.price.toLocaleString()}
																</p>
															</div>
														</div>
													</div>
												</Link>
											</CarouselItem>
										);
									})}
								</CarouselContent>
							</Carousel>
						</div>
					)}
				{!otherGigsLoading &&
					!otherGigsError &&
					otherGigs.length === 0 && (
						<div className="mt-8 text-center text-gray-600">
							<p>
								No other gigs found from {gig.influencer.name}.
							</p>
						</div>
					)}
			</div>
            <ShortFooter    />
		</>
	);
};

export default SingleGigPage;
