import SidebarLayout from '@/components/SidebarLayout';
import Navbar from '@/components/Navbar';
import { manageGigSidebar } from '@/constants/SidebarItems';

export default function GigsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<Navbar theme="light" />

			<SidebarLayout sidebarItems={manageGigSidebar}>
				{children}
			</SidebarLayout>
		</div>
	);
}
