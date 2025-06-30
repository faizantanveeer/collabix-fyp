'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Features from './FeatureSection';
import Testimonials from './Testimonial';
import Hero from './Hero';
import Chatbot from '@/components/Chatbot';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
	cards,
	spotlightCreators,
	collabixStats,
	howItWorks,
} from '@/seed/seed';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from './ui/carousel';

gsap.registerPlugin(ScrollTrigger);

const fontMap = {
	moglan: 'font-moglan',
	tomatogrotesk: 'font-tomatogrotesk',
};

const LandingPage = () => {
	useEffect(() => {
		const cards = document.querySelectorAll('.collabix-card');

		gsap.set(cards, { opacity: 0, y: 0 });
		gsap.set(cards[0], { opacity: 1, y: 0 });

		let tl = gsap.timeline({
			scrollTrigger: {
				trigger: '#why-collabix',
				start: 'top top',
				end: '+=500%',
				scrub: true,
				pin: true,
			},
		});

		cards.forEach((card, index) => {
			if (index < cards.length - 1) {
				tl.to(card, { opacity: 0, y: -10 }, `step-${index}-out`).to(
					cards[index + 1],
					{ opacity: 1, y: 0 },
					`step-${index + 1}-in`
				);
			}
		});
	}, []);

	return (
		<div className="">
			<Navbar />
			<Hero />

			{/* Why Collabix Section */}
			<section className="py-24 text-white relative" id="why-collabix">
				<div className="text-center mb-16 px-4">
					<h1 className="text-gray-900 text-4xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold mb-6">
						<span className="real font-extralight">
							But Why&nbsp;
						</span>
						Collabix?
					</h1>
					<p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
						A seamless platform where brands and creators collide —
						in the best way possible.
					</p>
				</div>

				<section className="text-white px-4 sm:px-8">
					<div className="sticky top-0 flex items-center justify-center">
						<div className="relative w-full max-w-7xl mx-auto h-auto min-h-[32rem]">
							{cards.map((card, index) => (
								<div
									key={index}
									className={`overflow-hidden transition-transform hover:-translate-y-2 duration-300 group collabix-card absolute top-0 left-0 w-full rounded-3xl flex flex-col-reverse sm:flex-row ${
										index === 1 ? 'sm:flex-row-reverse' : ''
									}`}
								>
									<div
										className={`w-full sm:w-1/2 p-6 flex flex-col gap-3 justify-center ${
											index === 1
												? 'items-start text-left'
												: 'items-end text-right'
										}`}
									>
										<h3
											className={`text-gray-900 text-4xl sm:text-6xl font-extrabold leading-tight ${
												index === 1
													? 'text-left'
													: 'text-right'
											}`}
										>
											{card.title.map((part, i) =>
												'br' in part && part.br ? (
													<br key={i} />
												) : (
													<span
														key={i}
														className={`${
															fontMap[
																(
																	part as {
																		text: string;
																		font: keyof typeof fontMap;
																	}
																).font
															]
														} mr-1`}
													>
														{
															(
																part as {
																	text: string;
																}
															).text
														}
													</span>
												)
											)}
										</h3>

										<p className="text-zinc-500 text-sm sm:text-md max-w-md break-words text-left">
											{card.description}
										</p>
									</div>

									<div className="w-full sm:w-1/2 h-64 sm:h-auto flex items-center justify-center">
										<Image
											src={card.image}
											alt={card.description}
											width={300}
											height={300}
											className="object-contain max-h-full w-auto transition-transform duration-300"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</section>

			{/* Creator Spotlight Carousel */}
			<section className="bg-gray-900 min-h-screen bg-[url('/images/spotlight-bg.jpg')] bg-cover bg-center px-4 sm:px-8 flex flex-col justify-center items-center sm:block py-20">
				<h2 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-12 leading-tight">
					<span className="font-moglan">Creator </span>Spotlight
				</h2>

				<div className="relative w-full mx-auto mt-10 sm:mt-16">
					<Carousel
						className="w-full"
						opts={{
							align: 'center',
							loop: true,
						}}
					>
						<CarouselContent>
							{spotlightCreators.map((creator, index) => (
								<CarouselItem
									key={`spotlight-${index}`}
									className="py-4 w-full sm:w-1/2 md:w-1/3"
								>
									<div className="text-white text-center px-2 sm:px-4">
										<div className="border w-32 h-32 sm:w-[20vh] sm:h-[20vh] mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
											<Image
												src={creator.image}
												alt="spotlight"
												width={250}
												height={250}
												className="object-cover w-full h-full"
											/>
										</div>
										<h3 className="text-xl sm:text-2xl font-bold">
											{creator.name}
										</h3>
										<p className="text-sm sm:text-lg mt-4 sm:mt-8 text-zinc-300 italic">
											“{creator.testimonial}”
										</p>
										<p className="text-xs sm:text-base text-zinc-300 mt-2">
											— {creator.handle}
										</p>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>

						<CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 text-white w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center z-10 transition-transform duration-300 transform hover:translate-x-[-4px] !bg-transparent !hover:bg-transparent !hover:shadow-none !ring-0 !border-none hover:text-white" />

						<CarouselNext className="absolute right-2 sm:right-4 top-1/2 text-white w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center z-10 transition-transform duration-300 transform hover:translate-x-[4px] !bg-transparent !hover:bg-transparent !hover:shadow-none !ring-0 !border-none hover:text-white" />
					</Carousel>
				</div>
			</section>

			{/* Wrapper  */}
			<div className="bg-[url('https://img.freepik.com/premium-photo/dot-pattern-png-transparent-background_53876-974532.jpg')] bg-repeat bg-[length:150px]">
				{/* For Brands */}
				<section className="text-gray-900 min-h-screen relative px-4">
					<div className="flex flex-col-reverse lg:flex-row items-center justify-center min-h-screen max-w-6xl container mx-auto gap-12">
						<div className="w-full lg:w-1/2 h-full text-center lg:text-left">
							<div className="flex flex-col gap-4 items-center lg:items-start justify-center h-full max-w-xl mx-auto lg:mx-0">
								<h2 className="text-tomatogrotesk text-gray-900 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
									Creators are new <br />
									<span className="font-moglan">
										Billboards
									</span>
								</h2>

								<p className="text-muted-foreground text-sm sm:text-md text-zinc-600 break-words mb-4">
									Want eyeballs without the ad fatigue? <br />
									Creators are the new billboards.
									<br />
									Post a collab, set your vibe, and watch Gen
									Z make it trend.
								</p>

								<Link href="/login">
									<button
										type="button"
										className="group relative z-10 px-6 py-2 bg-gray-900 rounded-full text-white font-semibold text-base lg:text-lg shadow-md overflow-hidden hover:border-none"
									>
										<span className="text-white relative z-10 transition duration-300 group-hover:text-gray-900">
											Launch Your First Colab
										</span>
										<span className="absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] bg-white rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0" />
									</button>
								</Link>
							</div>
						</div>

						<div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 flex items-center justify-center">
							<Image
								src="/images/camera1.png"
								alt="start your first campaign"
								width={500}
								height={500}
								className="object-contain w-full h-full max-w-md scale-x-[-1]"
							/>
						</div>
					</div>
				</section>

				{/* For Creators */}
				<section className="text-gray-900 min-h-screen relative px-4">
					<div className="flex flex-col lg:flex-row items-center justify-center min-h-screen container mx-auto gap-12">
						<div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 flex items-center justify-center">
							<Image
								src="/images/cameraman1.png"
								alt="start your first campaign"
								width={500}
								height={500}
								className="object-contain w-full h-full max-w-md scale-x-[-1]"
							/>
						</div>

						<div className="w-full lg:w-1/2 h-full text-center lg:text-left">
							<div className="flex flex-col gap-4 items-center lg:items-start justify-center h-full max-w-xl mx-auto lg:mx-0">
								<h2 className="text-tomatogrotesk text-gray-900 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
									Content is the new <br />
									<span className="font-moglan">
										Currency
									</span>
								</h2>

								<p className="text-muted-foreground text-sm sm:text-md text-zinc-600 break-words mb-4">
									Tired of DMs and fake promises? <br />
									Join a platform built for your hustle.
									<br />
									Apply to collabs, set your price, grow your
									bag.
								</p>

								<Link href="/login">
									<button
										type="button"
										className="group relative z-10 px-6 py-2 bg-gray-900 rounded-full text-white font-semibold text-base lg:text-lg shadow-md overflow-hidden hover:border-none"
									>
										<span className="text-white relative z-10 transition duration-300 group-hover:text-gray-900">
											Join as a Creator
										</span>
										<span className="absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] bg-white rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0" />
									</button>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* Your Rules, Your Rates, Your Creativity Section */}
			<section className="bg-gray-900 py-12 px-4">
				<div className="text-center max-w-6xl mx-auto">
					<h2 className="text-tomatogrotesk text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight leading-tight">
						Your&nbsp;
						<span className="font-moglan">Rules</span>&nbsp;-&nbsp;
						Your&nbsp;
						<span className="font-moglan">Rates</span>&nbsp;-&nbsp;
						Your&nbsp;
						<span className="font-moglan">Creativity</span>
					</h2>
				</div>
			</section>

			{/* <Features /> */}

			{/* <Testimonials /> */}

			{/* Time Line Section */}
			<section>
				<div className="max-w-6xl mx-auto py-24 px-4">
					<h2 className="text-tomatogrotesk text-gray-900 text-4xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 font-extrabold text-center leading-tight">
						<span className="font-moglan">How we</span>&nbsp;Work?
					</h2>

					<div className="relative mt-16">
						{/* Timeline Line */}
						{/* Horizontal line for desktop */}
						<div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-red-700 transform -translate-y-1/2 z-0" />

						{/* Vertical line for mobile */}
						<div className="block md:hidden absolute top-0 left-1/2 h-full w-0.5 bg-red-700 transform -translate-x-1/2 z-0" />

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 text-center relative z-10">
							{howItWorks.map((item, index) => (
								<div key={index} className="relative">
									<div className="bg-white border border-gray-900 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300 hover:cursor-pointer">
										{/* Dot */}
										<div className="w-4 h-4 bg-white rounded-full mx-auto mb-6 border-4 border-red-700 z-10 relative" />
										{item.icon && (
											<Image
												src={item.icon}
												alt={item.step}
												width={100}
												height={100}
												className="w-16 h-16 mx-auto mb-4"
											/>
										)}
										<h3 className="text-lg sm:text-xl font-semibold text-gray-900">
											{item.step}
										</h3>
										<p className="text-sm text-zinc-500 mt-2">
											{item.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Collabix Stats Section */}
			<section className="bg-zinc-500 text-white py-16 sm:py-24 bg-[url('https://img.freepik.com/premium-photo/dot-pattern-png-transparent-background_53876-974532.jpg')] bg-repeat bg-[length:150px] bg-center relative flex items-center justify-center">
				<div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center w-full">
					{collabixStats.map((stat, i) => (
						<div key={i}>
							<Image
								src={stat.icon}
								alt={stat.label}
								width={50}
								height={50}
								className="mx-auto mb-4 h-16 w-16"
							/>
							<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
								{stat.number}
							</h3>
							<p className="text-sm sm:text-base text-zinc-500 mt-1">
								{stat.label}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Footer */}
			<Footer />
			<Chatbot />
		</div>
	);
};

export default LandingPage;
