'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // ShadCN button
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { toast } from 'sonner'; // Notification library
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageCircle, ArrowLeft, Users, Award } from 'lucide-react'; // Better icons
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton'; // ShadCN skeleton loader
import ShortFooter from '@/components/ShortFooter';

type SocialLink = {
	platform: string;
	link: string;
};

type PortfolioItem = {
	title: string;
	// Add other fields if needed
};

type InfluencerDetails = {
	totalFollowers: number;
	pastCollaborations?: string[];
	// Add other fields if needed
};

type Influencer = {
	_id?: string;
	name: string;
	niche: string;
	bio: string;
	profileImage?: string;
	socialLinks?: SocialLink[];
	influencerDetails: InfluencerDetails;
	portfolio?: PortfolioItem[];
	// Add other fields if needed
};

export default function InfluencerProfile() {
	const router = useRouter();
	const { data: session } = useSession();
	const { id } = useParams();
	const [influencer, setInfluencer] = useState<Influencer | null>(null);
	const [loading, setLoading] = useState(true);
	const [businessId, setBusinessId] = useState('65d1234567abc890');
	type Gig = {
		_id?: string;
		title: string;
		description: string;
		price: number;
		images?: string[];
		// Add other fields as needed
	};

	const [gigs, setGigs] = useState<Gig[]>([]);
	const [gigsLoading, setGigsLoading] = useState(true);

	const handleCollab = () => {
		if (influencer) {
			router.push(`/collaboration?id=${id}`);
		}
	};

	useEffect(() => {
		if (session?.user?.id) {
			setBusinessId(session.user.id);
		}
		const fetchInfluencer = async () => {
			try {
				const res = await fetch(
					`http://localhost:5000/influencers/${id}`
				);
				const data = await res.json();
				setInfluencer(data);
			} catch (error) {
				console.error('Error fetching influencer:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchInfluencer();
	}, [id]);

	console.log('Influencer:', influencer); // Debugging line to check fetched influencer

	useEffect(() => {
		const fetchGigs = async () => {
			if (influencer?._id) {
				try {
					const gigRes = await fetch(
						`http://localhost:5000/gigs/explore_gigs?influencerId=${influencer._id}`
					);
					const gigsData = await gigRes.json();
					setGigs(gigsData);
				} catch (err) {
					console.error('Error fetching gigs:', err);
					setGigs([]);
				} finally {
					setGigsLoading(false);
				}
			}
		};
		fetchGigs();
	}, [influencer]);

	return (
		<>
			<div>
				<Navbar theme="light" />
				<div className="container mx-auto p-6 max-w-3xl mt-16">
					{/* Skeleton Loader */}
					{loading && (
						<div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
							<Skeleton className="w-60 h-60 rounded-full" />
							<Skeleton className="w-40 h-6 mt-4" />
							<Skeleton className="w-32 h-5 mt-2" />
							<Skeleton className="w-24 h-5 mt-2" />
							<Skeleton className="w-full h-32 mt-6" />
						</div>
					)}

					{/* Main Profile */}
					{!loading && influencer && (
						<div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center">
							{/* Profile Image */}
							<Image
								src={
									influencer.profileImage &&
									!influencer.profileImage.startsWith(
										'/images/'
									)
										? `http://localhost:5000/uploads/profiles/${influencer.profileImage}`
										: '/images/placeholder.png'
								}
								alt={influencer.name}
								width={300}
								height={300}
								className="w-64 h-64 rounded-full border-4 border-blue-500 shadow-md object-cover"
							/>

							{/* Name & Info */}
							<h1 className="text-3xl font-bold mt-4">
								{influencer.name}
							</h1>
							<p className="text-gray-500 text-lg">
								{influencer.niche}
							</p>
							<div className="flex items-center gap-2 text-gray-600 font-semibold text-lg mt-2">
								<Users size={20} /> Follower Count:{' '}
								<span className="font-bold">
									{
										influencer.influencerDetails
											.totalFollowers
									}
								</span>
							</div>
							<p className="text-gray-700 mt-4">
								<span>Bio: </span>
								{influencer.bio}
							</p>

							{/* Social Links */}
							<div className="flex space-x-4 mt-4">
								{influencer.socialLinks?.map(
									(social, index) => (
										<a
											key={index}
											href={social.link}
											target="_blank"
											className="text-2xl hover:opacity-75"
										>
											{social.platform ===
												'Instagram' && (
												<FaInstagram className="text-pink-500" />
											)}
											{social.platform === 'Twitter' && (
												<FaTwitter className="text-blue-400" />
											)}
											{social.platform === 'YouTube' && (
												<FaYoutube className="text-red-500" />
											)}
										</a>
									)
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 w-full mt-6">
								{session?.user?.role === 'business' ? (
									<>
										<Button
											onClick={handleCollab}
											className="flex-1"
										>
											Collaborate
										</Button>
									</>
								) : (
									<div className="w-full">
										<Button className="cursor-not-allowed w-full">
											Collaborate
										</Button>
										<p className="text-sm text-gray-500 mt-2">
											Please sign up as a business to
											collaborate with influencers
										</p>
									</div>
								)}
								<Button
									variant="outline"
									onClick={() => router.push(`/chat/${id}`)}
									className="flex items-center gap-2"
								>
									<MessageCircle size={20} />
									Message
								</Button>
							</div>
						</div>
					)}
				</div>
				{/* Gigs by Influencer */}
				<div className="mt-12 max-w-6xl mx-auto p-6">
					<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
						Explore Other Gigs by {influencer ? influencer.name : ''}
					</h2>

					{gigsLoading ? (
						<div className="text-center text-gray-500">
							Loading gigs...
						</div>
					) : gigs.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{gigs.map((gig) => (
								<div
									key={gig._id}
									className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
								>
									<div className="relative w-full h-40 mb-4 overflow-hidden rounded">
										<Image
											src={
												gig.images &&
												gig.images.length > 0
													? gig.images[0].startsWith(
															'http'
													  )
														? gig.images[0]
														: `http://localhost:5000/uploads/${gig.images[0]}`
													: '/images/gig_image.png'
											}
											alt={gig.title}
											fill
											className="object-cover rounded"
										/>
									</div>
									<h3 className="text-lg font-semibold">
										{gig.title}
									</h3>
									<p className="text-sm text-gray-600 mb-2">
										{gig.description?.slice(0, 80)}
										{gig.description &&
										gig.description.length > 80
											? '...'
											: ''}
									</p>
									<p className="font-bold text-gray-900">
										Rs. {gig.price}
									</p>
									<Button
										variant="outline"
										className="mt-2 w-full"
										onClick={() =>
											router.push(
												`/explore_gigs/${gig._id}`
											)
										}
									>
										View Gig
									</Button>
								</div>
							))}
						</div>
					) : (
						<p className="text-center text-gray-500">
							No gigs found{influencer ? ` for ${influencer.name}` : ''}.
						</p>
					)}
				</div>
			</div>
		</>
	);
}
