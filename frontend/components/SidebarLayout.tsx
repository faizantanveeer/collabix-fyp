'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { dashboardSidebar, manageGigSidebar } from '@/constants/SidebarItems';
import { UserContext } from '../context/UserContext';
import { UserData } from '@/types';

interface SidebarItem {
	label: string;
	href: string;
	icon: React.ReactNode;
}

interface SidebarLayoutProps {
	children: React.ReactNode;
	sidebarItems?: SidebarItem[];
	userData?: UserData | null;
}

export default function SidebarLayout({
	children,
	sidebarItems,
	userData,
}: SidebarLayoutProps) {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(true);

	return (
		<UserContext.Provider value={userData ?? null}>
			
			<div className="flex min-h-screen pt-16">
				{/* Sidebar */}
				<aside
					className={`bg-gray-900 text-white transition-all duration-300 z-40 sticky top-16 h-[calc(100vh-4rem)]
          ${isOpen ? 'w-64' : 'w-16'} flex flex-col p-4`}
				>
					{/* Toggle Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="absolute top-1/2 right-[-14px] bg-gray-900 p-2 rounded-full shadow-lg z-50 transform -translate-y-1/2"
					>
						<div className="relative">
							<span className="absolute inset-0 w-full h-full animate-ping bg-gray-600 rounded-full opacity-75"></span>
							{isOpen ? (
								<ArrowLeftCircle
									size={28}
									className="text-white relative z-10"
								/>
							) : (
								<ArrowRightCircle
									size={28}
									className="text-white relative z-10"
								/>
							)}
						</div>
					</button>

					{/* Navigation */}
					<ul className="mt-4 space-y-2">
						{(sidebarItems ?? []).map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className={`w-full flex items-center justify-${
										isOpen ? 'start' : 'center'
									} gap-3 p-3 rounded-lg transition-all
									${isOpen ? 'hover:bg-gray-700' : 'hover:bg-gray-800'}
									${pathname === item.href ? 'bg-gray-700' : ''}`}
								>
									<span className="flex items-center justify-center">
										{item.icon}
									</span>
									{isOpen && <span>{item.label}</span>}
								</Link>
							</li>
						))}
					</ul>
				</aside>

				{/* Main content area */}
				<main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900 text-black dark:text-white">
					{children}
				</main>
			</div>
		</UserContext.Provider>
	);
}
