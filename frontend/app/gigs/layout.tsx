'use client';
import SidebarLayout from '@/components/SidebarLayout';
import Navbar from '@/components/Navbar';
import { manageGigSidebar } from '@/constants/SidebarItems';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GigsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, status } = useSession();
	const router = useRouter();

	// if (status === 'loading') return;

	// if (!session?.user) {
	// 	router.push('/login');
	// }
	return (
		<div>
			<Navbar theme="light" />

			<SidebarLayout sidebarItems={manageGigSidebar}>
				{children}
			</SidebarLayout>
		</div>
	);
}
