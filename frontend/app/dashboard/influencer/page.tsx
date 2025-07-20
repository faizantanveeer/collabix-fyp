'use client';
import { useState, lazy, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/influencer-components/Dashboard';
import Chat from '@/components/influencer-components/Chat';
import Notifications from '@/components/influencer-components/Notifications';
import Profile from '@/components/influencer-components/Profile';
import { UserData } from '@/types';
import NProgressProvider from '@/components/NProgressProvider';

// Lazy load the Collaborations component
const Collaborations = lazy(
	() => import('@/components/influencer-components/Collaborations')
);

interface InfluencerDashboardProps {
	userData: UserData | null;
}

export default function InfluencerDashboard({
	userData,
}: InfluencerDashboardProps) {
	const [activeSection, setActiveSection] = useState('Overview');
	const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

	return (
		<div className="flex h-screen">
			{/* Sidebar - Controlled by isSidebarOpen */}
			<Sidebar
				role="influencer"
				setActiveSection={setActiveSection}
				isOpen={isSidebarOpen}
				setIsOpen={setIsSidebarOpen}
			/>

			{/* Main Content - Adjusts margin dynamically */}
			<main
				className={`flex-1 p-5 h-full overflow-y-auto transition-all duration-300
          ${isSidebarOpen ? 'md:ml-0 ml-0' : 'ml-16 md:ml-0'}
        `}
			>
				{activeSection === 'Overview' && (
					<Dashboard userData={userData} />
				)}
				{activeSection === 'Collaborations' && (
					<Suspense fallback={<NProgressProvider />}>
						<Collaborations userData={userData} />
					</Suspense>
				)}
				{activeSection === 'Chat' && <Chat />}
				{activeSection === 'Notifications' && (
					<Notifications userData={userData} />
				)}
				{activeSection === 'Profile' && <Profile userData={userData} />}
			</main>
		</div>
	);
}
