'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { pricingCards } from '@/seed/seed';
import Image from 'next/image';

export default function Contact() {
	return (
		<div className="min-h-screen  text-white">
			<Navbar theme="dark" />

			{/* Hero Section */}
			<section className="flex flex-col items-center justify-center py-24 h-[80vh] bg-gradient-to-b from-gray-900 to-black text-center px-4">
				<h1 className="text-4xl sm:text-5xl md:text-6xl  mb-6">
					No Collab?
					<span className="font-moglan"> No Fee.</span>
				</h1>
				<p className="text-zinc-400 max-w-2xl mx-auto text-lg sm:text-xl">
					No subscriptions. No upfronts. Just that sweet 2% once you
					lock the deal.
				</p>
			</section>

			{/* Pricing Breakdown */}
			<section className="py-20 text-gray-900 bg-white px-4">
				<div className="max-w-5xl mx-auto text-center">
					<h2 className="text-4xl sm:text-4xl font-semibold mb-4">
						You <span className="font-moglan">Close</span> It, We
						Take 2%
					</h2>
					<p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
						Close a collab? We take 2%. Not 20. Not even 5. Just
						two. Like two TikToks. That’s how we keep Collabix alive
						and thriving.
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
					{pricingCards.map((card, index) => (
						<div
							key={index}
							className="bg-white  border-gray-900 rounded-2xl p-6 border hover:scale-105 transition-transform"
						>
							<Image
								src={card.icon}
								alt={card.title}
								height={1000}
								width={100}
								className="h-16 w-16 mb-4"
							/>
							<h3 className="text-2xl font-bold text-gray-900 mb-">
								{card.title}
							</h3>
							<p className="text-gray-500 mb-4">
								{card.description}
							</p>
							<ul className="list-disc list-inside space-y-2 text-gray-500 text-sm pl-2">
								{card.features.map((feature, i) => (
									<li key={i}>{feature}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-gray-900 text-center px-4 ">
				<h2 className="text-3xl sm:text-4xl font-bold mb-6">
					Start Collaborating with Confidence
				</h2>
				<p className="text-zinc-400 mb-8">
					Zero upfront fees. Just results. Sign up and launch your
					first campaign today.
				</p>
				<Link href="/signup">
					<button className="group relative z-10 px-6 py-3 border border-white text-white rounded-full font-semibold text-lg overflow-hidden">
						<span className="relative z-10 transition duration-300 group-hover:text-gray-900">
							Get Started for Free
						</span>
						<span className="absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] bg-white rounded-[50%] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0" />
					</button>
				</Link>
			</section>

			<Footer />
		</div>
	);
}
