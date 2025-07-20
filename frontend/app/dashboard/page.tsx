'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import InfluencerDashboard from '../dashboard/influencer/page';
import BusinessDashboard from '../dashboard/business/page';
import { UserData } from '../../types';
import Navbar from '@/components/Navbar';
import { PulseLoader } from 'react-spinners';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function Dashboard() {
	const { data: session, status } = useSession();
	const [userData, setUserData] = useState<UserData | null>(null);
	const router = useRouter();

	const fetchUserProfile = async () => {
		const res = await fetch('http://localhost:5000/dashboard', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session?.accessToken}`, // Send token
			},
			credentials: 'include', // Send cookies automatically
		});

		const data = await res.json();

		// console.log(userData);

		setUserData(data);
	};

	useEffect(() => {
		// Start or stop NProgress based on status
		if (status === 'loading') {
			NProgress.start();
		} else {
			NProgress.done();
		}

		// Redirect to login if not authenticated
		if (!session?.user && status !== 'loading') {
			router.push('/login');
		}

		// Fetch profile only when authenticated
		if (status === 'authenticated') {
			fetchUserProfile();
		}
	}, [session, status, router]);

	if (!session?.user) return null; // Avoid rendering if user is not logged in

	// Convert role to lowercase
	const userRole = session.user.role?.toLowerCase();

	return (
		<div className="h-screen overflow-y-hidden">
			<Navbar theme="light" />
			<div className="mt-16">
				{/* <InfluencerDashboard userData={userData} /> */}
				{userRole === 'influencer' ? (
					<InfluencerDashboard userData={userData} />
				) : (
					<BusinessDashboard userData={userData} />
				)}
			</div>
		</div>
	);
}
