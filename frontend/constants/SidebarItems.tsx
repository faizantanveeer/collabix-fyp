// constants/sidebarItems.tsx
import {
	LayoutDashboard,
	Settings,
	Briefcase,
	Users,
	MessageCircle,
	Bell,
	User,
	Handshake,
} from 'lucide-react';

export const dashboardSidebar = {
	influencer: [
		{
			label: 'Overview',
			href: '/dashboard/overview',
			icon: <LayoutDashboard size={20} />,
		},
		{
			label: 'Collaborations',
			href: '/dashboard/collaborations',
			icon: <Handshake size={20} />,
		},
		{
			label: 'Chat',
			href: '/dashboard/chat',
			icon: <MessageCircle size={20} />,
		},
		{
			label: 'Notifications',
			href: '/dashboard/notifications',
			icon: <Bell size={20} />,
		},
		// {
		// 	label: 'Profile',
		// 	href: '/dashboard/profile',
		// 	icon: <User size={20} />,
		// },
	],
	brand: [
		{
			label: 'Overview',
			href: '/dashboard/overview',
			icon: <LayoutDashboard size={20} />,
		},
		{
			label: 'Collaborations',
			href: '/dashboard/collaborations',
			icon: <Handshake size={20} />,
		},
		{
			label: 'Chat',
			href: '/dashboard/chat',
			icon: <MessageCircle size={20} />,
		},
		{
			label: 'Notifications',
			href: '/dashboard/notifications',
			icon: <Bell size={20} />,
		},
		{
			label: 'Profile',
			href: '/dashboard/profile',
			icon: <User size={20} />,
		},
	],
};

export const manageGigSidebar = [
	{ label: 'My Gigs', href: '/gigs', icon: <Briefcase /> },
	{ label: 'Create New', href: '/gigs/new', icon: <LayoutDashboard /> },
	{ label: 'Earnings', href: '/gigs/earnings', icon: <Settings /> },
];
