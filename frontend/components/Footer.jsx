import Link from 'next/link';
import React from 'react';

function Footer() {
	return (
		<div className="bg-[url('https://img.freepik.com/premium-photo/dot-pattern-png-transparent-background_53876-974532.jpg')] bg-repeat bg-[length:150px] bg-center">
			<footer className="bg-gradient-to-t from-gray-800 to-gray-900 text-white rounded-t-3xl mt-24">
				{/* Top CTA Box */}
				<div className="relative -top-16 z-10 px-4">
					<div className="bg-white text-zinc-900 rounded-3xl shadow-xl border-2 border-gray-900 max-w-4xl mx-auto px-6 py-10 md:py-20 flex flex-col md:flex-row items-center justify-center text-center gap-6 relative overflow-hidden">
						<div className="flex flex-col gap-4 z-10">
							<h3 className="text-gray-900 font-tomatogrotesk text-2xl md:text-6xl font-bold">
								Ready to Collab?
							</h3>
							<p className="text-gray-900 text-lg md:text-xl font-light">
								Whether you’re a brand ready to boom or a
								creator ready to flex.
							</p>

							<div className="flex flex-col sm:flex-row justify-center gap-4">
								<Link href="/influencer">
									<button
										type="button"
										className="group relative z-10 px-6 py-2 border border-gray-900 rounded-full text-gray-900 font-semibold text-base lg:text-lg backdrop-blur-md shadow-md overflow-hidden"
									>
										<span className="relative z-10 transition duration-300 group-hover:text-white">
											Explore Creators
										</span>
										<span className="absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] bg-gray-900 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0" />
									</button>
								</Link>

								<Link href="/login">
									<button
										type="button"
										className="group relative z-10 px-6 py-2 border border-gray-900 rounded-full text-gray-900 font-semibold text-base lg:text-lg backdrop-blur-md shadow-md overflow-hidden"
									>
										<span className="relative z-10 transition duration-300 group-hover:text-white">
											Get Started
										</span>
										<span className="absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] bg-gray-900 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0" />
									</button>
								</Link>
							</div>
						</div>

						{/* Decorative Pattern */}
						<div className="hidden md:block absolute -right-28 -bottom-28 w-96 opacity-20">
							<img src="/images/weirdPattern.svg" alt="Pattern" />
						</div>
					</div>
				</div>

				{/* Footer Main */}
				<div className="px-4 md:px-16 border-t py-8 border-white/10">
					<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
						<img
							src="/images/logo.png"
							alt="Collabix Logo"
							className="w-32 md:w-40"
						/>

						<div className="flex flex-col sm:flex-row justify-between w-full gap-10">
							<div>
								<h4 className="text-lg font-semibold mb-4">
									Quick Links
								</h4>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											className="text-white/80 hover:underline"
										>
											Try Collabix
										</a>
									</li>
									<li>
										<a
											href="/#"
											className="text-white/80 hover:underline"
										>
											Privacy Policy
										</a>
									</li>
									<li>
										<a
											href="/term#s"
											className="text-white/80 hover:underline"
										>
											Terms & Conditions
										</a>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="text-lg font-semibold mb-4">
									Contact Us
								</h4>
								<p className="text-white/70 mb-1">
									Issues? Email us at:
								</p>
								<a
									href="mailto:info2mypath@gmail.com"
									className="underline text-white"
								>
									info@collabix.com
								</a>
							</div>
						</div>
					</div>

					{/* Footer Bottom */}
					<div className="text-sm text-gray-500 text-center mt-8">
						© 2025 Collabix. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}

export default Footer;
