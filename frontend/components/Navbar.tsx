'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
	User,
	LogOut,
	Menu,
	X,
	LogIn,
	UserPlus,
	LayoutDashboard,
	Users,
	Briefcase,
	Mail,
	DollarSign,
	Home,
	HomeIcon,
	Grid3x3,
	FileText,
	ListChecks,
	ClipboardList,
	Group,
	UserRound,
	Handshake,
} from 'lucide-react';

export function Navbar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
	const isDark = theme === 'dark';

	const { data: session, status } = useSession();
	const [profileData, setProfileData] = useState<{
		profileImage: string;
	} | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [scrolled, setScrolled] = useState(false);

	const textColor = scrolled || !isDark ? 'text-gray-900' : 'text-white';

	useEffect(() => {
		if (session?.user?.id) {
			// console.log(session)
			fetchProfileData();
		}
	}, [session]);

	async function fetchProfileData() {
		try {
			const res = await fetch(
				`http://localhost:5000/user/profile/${session?.user?.id}`
			);
			if (res.ok) {
				const data = await res.json();
				setProfileData({ profileImage: data.profile.profileImage });
			}
		} catch (error) {
			console.error('Error fetching profile data:', error);
		}
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}

		if (dropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [dropdownOpen]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > window.innerHeight * 0.9) {
				setScrolled(true); // Passed the hero
			} else {
				setScrolled(false); // Still in hero
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);
	return (
		<div
			className={`fixed top-0 w-full z-50  backdrop-blur-md shadow-md transition-colors duration-300 pt-[env(safe-area-inset-top)] ${
				scrolled
					? 'bg-white/80 backdrop-blur-md shadow-md'
					: isDark
					? 'bg-transparent'
					: 'bg-white'
			}`}
		>
			<nav className="container flex items-center justify-between mx-auto px-4 ">
				{/* Logo */}
				<Link
					href="/"
					className="text-2xl font-bold text-white flex items-center"
				>
					<Image
						key={!scrolled && isDark ? 'logo-light' : 'logo-dark'}
						src={
							!scrolled && isDark
								? '/images/logo.png'
								: '/images/logob.png'
						}
						alt="Logo"
						width={60}
						height={60}
					/>
				</Link>

				{/* Desktop Navigation */}

				{session ? (
					<>
						<div className="hidden md:flex gap-6">
							<Link href="/">
								<Button
									variant="link"
									className={`text-lg hover:no-underline transition-colors duration-300 ${textColor}`}
								>
									Home
								</Button>
							</Link>
							<Link href="/dashboard">
								<Button
									variant="link"
									className={`text-lg hover:no-underline transition-colors duration-300 ${textColor}`}
								>
									Dashboard
								</Button>
							</Link>
							<Link href="/influencer">
								<Button
									variant="link"
									className={`text-lg hover:no-underline transition-colors duration-300 ${textColor}`}
								>
									Influencers
								</Button>
							</Link>
							<Link href="/gigs">
								<Button
									variant="link"
									className={`text-lg hover:no-underline transition-colors duration-300 ${textColor}`}
								>
									Manage Gigs
								</Button>
							</Link>
						</div>
					</>
				) : (
					<>
						<div className="hidden md:flex gap-6">
							{[
								'/',
								'/gigs',
								'/influencer',
								'/pricing',
								// '/meet-our-team',
							].map((href, i) => (
								<Link key={i} href={href}>
									<Button
										variant="link"
										className={`text-lg hover:no-underline transition-colors duration-300 ${textColor}`}
									>
										{
											[
												'Home',
												'Explore Gigs',
												'Influencers',
												'Pricing',
												// 'Meet Our Team',
											][i]
										}
									</Button>
								</Link>
							))}
						</div>
					</>
				)}

				{/* Profile / Auth Section */}
				<div className="flex items-center gap-4">
					{session ? (
						<div
							className="relative hidden md:block"
							ref={dropdownRef}
						>
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="flex items-center gap-2 focus:outline-none"
							>
								<Image
									src={
										profileData?.profileImage
											? profileData.profileImage.startsWith(
													'http'
											  )
												? profileData.profileImage
												: profileData.profileImage.startsWith(
														'/images/'
												  )
												? profileData.profileImage
												: `http://localhost:5000/uploads/profiles/${profileData.profileImage}`
											: '/images/placeholder.png'
									}
									alt="Profile"
									className="w-10 h-10 rounded-full object-cover border p-1 cursor-pointer"
									width={40}
									height={40}
								/>
							</button>
							{dropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-50">
									<Link href="/profile">
										<div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer transition-colors font-medium">
											<User size={18} /> Profile
										</div>
									</Link>
									<button
										onClick={() => signOut()}
										className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-200 hover:text-red-500 cursor-pointer transition-colors font-medium"
									>
										<LogOut size={18} /> Log Out
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="hidden md:flex gap-3">
							<Link href="/login">
								<button
									type="button"
									className={`group relative z-10 px-6 py-2 border ${
										scrolled || !isDark
											? 'border-gray-900 text-gray-900'
											: 'border-white text-white'
									} rounded-full font-semibold text-base lg:text-lg overflow-hidden`}
								>
									<span
										className={`relative z-10 transition duration-300 group-hover:${
											scrolled || !isDark
												? 'text-white'
												: 'text-gray-900'
										}`}
									>
										Get Started
									</span>
									<span
										className={`absolute bottom-[-40%] left-1/2 w-[200%] h-[200%] ${
											scrolled || !isDark
												? 'bg-gray-900'
												: 'bg-white'
										} rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-bottom translate-x-[-50%] z-0`}
									/>
								</button>
							</Link>
						</div>
					)}

					{/* Mobile Menu Button */}
					<button
						className={`md:hidden p-2 transition-transform duration-300 z-50 ${
							scrolled || mobileMenuOpen
								? 'text-gray-900'
								: 'text-white'
						}`}
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X size={24} />
						) : (
							<Menu
								size={24}
								className={`${
									scrolled || !isDark
										? 'text-gray-900'
										: 'text-white'
								}`}
							/>
						)}
					</button>
				</div>

				{/* Mobile Navigation Menu */}

				<div
					className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg transform ${
						mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
					} transition-transform duration-300 md:hidden z-40`}
				>
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
						<span className="text-xl  font-semibold text-gray-900">
							Menu
						</span>
						<button
							onClick={() => setMobileMenuOpen(false)}
							className="text-gray-900 p-2 focus:outline-none"
							aria-label="Close Menu"
						></button>
					</div>
					{session ? (
						<>
							<div className="flex flex-col gap-3 px-6 mt-4 mb-4">
								<Link
									href="/"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2 text-gray-900"
									>
										<HomeIcon size={18} /> Home
									</Button>
								</Link>
								<Link
									href="/dashboard"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2 text-gray-900"
									>
										<LayoutDashboard size={18} /> Dashboard
									</Button>
								</Link>
								<Link
									href="/influencer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2 text-gray-900"
									>
										<Users size={18} /> Influencers
									</Button>
								</Link>
								<Link
									href="/gigs"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2 text-gray-900"
									>
										<ClipboardList size={18} /> Manage Gigs
									</Button>
								</Link>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col gap-3 px-6 mt-4 mb-4">
								<Link
									href="/dashboard"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2  text-gray-900"
									>
										<LayoutDashboard size={18} /> Dashboard
									</Button>
								</Link>
								<Link
									href="/influencer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2  text-gray-900"
									>
										<Users size={18} /> Influencers
									</Button>
								</Link>
								<Link
									href="/pricing"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2  text-gray-900"
									>
										<DollarSign size={18} /> Pricing
									</Button>
								</Link>
								<Link
									href="/meet-our-team"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className="w-full text-left flex items-center gap-2 text-gray-900"
									>
										<Handshake size={18} /> Meet Our Team
									</Button>
								</Link>
							</div>
						</>
					)}

					{/* Auth Section in Mobile */}
					<div className=" px-6 border-t">
						{session ? (
							<>
								<Link
									href="/profile"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className={`w-full text-left flex items-center gap-2 mt-4 text-gray-900`}
									>
										<UserRound size={18} /> Profile
									</Button>
								</Link>
								<Button
									onClick={() => signOut()}
									variant="ghost"
									className={`w-full text-left flex items-center gap-2 mt-2 text-gray-900`}
								>
									<LogOut size={18} /> Log Out
								</Button>
							</>
						) : (
							<div className="flex flex-col gap-3 mt-4">
								<Link
									href="/login"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className={`w-full text-left flex items-center gap-2 text-gray-900`}
									>
										<LogIn size={18} /> Log In
									</Button>
								</Link>
								<Link
									href="/signup"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant="ghost"
										className={`w-full text-left flex items-center gap-2 text-gray-900`}
									>
										<UserPlus size={18} /> Sign Up
									</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</nav>
		</div>
	);
}

export default Navbar;
