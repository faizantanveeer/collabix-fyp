'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
	return (
		<section className="back-image bg-cover bg-center min-h-screen w-full flex flex-col sm:block justify-center items-center sm:items-start">
			<div className="py-20 sm:py-24 lg:py-32 px-4 w-full">
				<div className="ml-0 sm:ml-16 flex flex-col justify-center items-center sm:items-start w-full sm:max-w-xl text-center sm:text-left mx-auto">
					<div>
						<h1 className="text-white text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
							<span className="real font-extralight text-white">
								Real&nbsp;
							</span>
							Creators.
							<br />
							<span className="real font-extralight text-white">
								Real&nbsp;
							</span>
							Impact.
						</h1>
					</div>

					<p className="text-muted-foreground font-Sagace text-base sm:text-lg md:text-xl max-w-xl mx-auto sm:mx-0 mb-8">
						Brands meet bold creators. No middlemen. No cringe.
					</p>

					<div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 w-full max-w-md sm:max-w-none">
						<Link href="/influencer" className="w-full sm:w-auto">
							<button
								type="button"
								className="w-full sm:w-auto group relative z-10 px-6 py-2 border border-white rounded-full text-white font-semibold text-base lg:text-lg backdrop-blur-md shadow-md overflow-hidden"
							>
								<span className="relative z-10 transition duration-300 group-hover:text-gray-900">
									Explore Creators
								</span>
								<span className="absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] bg-white rounded-[50%] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0" />
							</button>
						</Link>

						<Link href="/login" className="w-full sm:w-auto">
							<button
								type="button"
								className="w-full sm:w-auto group relative z-10 px-6 py-2 border border-white rounded-full text-white font-semibold text-base lg:text-lg backdrop-blur-md shadow-md overflow-hidden"
							>
								<span className="relative z-10 transition duration-300 group-hover:text-gray-900">
									Get Started
								</span>
								<span className="absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] bg-white rounded-[50%] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0" />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
