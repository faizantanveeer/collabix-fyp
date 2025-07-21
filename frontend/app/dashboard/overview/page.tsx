'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import Dashboard from '@/components/influencer-components/Dashboard';

import { useUser } from '@/context/UserContext';
import { UserData } from '@/types';

export default function InfluencerOverviewPage() {
	const userContext = useUser() as unknown as { userData: UserData | null };
	const { data: session, status } = useSession();
	const [userData, setUserData] = useState<UserData | null>(
		userContext?.userData ?? null
	);
	const router = useRouter();

	useEffect(() => {
		if (status === 'loading') {
			NProgress.start();
		} else {
			NProgress.done();
		}

		if (!session?.user && status !== 'loading') {
			router.push('/login');
		}

		if (status === 'authenticated') {
			const fetchUserProfile = async () => {
				const res = await fetch('http://localhost:5000/dashboard', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${session?.accessToken}`,
					},
					credentials: 'include',
				});
				const data = await res.json();
				setUserData(data);
			};

			fetchUserProfile();
		}
	}, [session, status]);

	if (!session?.user) return null;

	return <Dashboard userData={userData} />;
}
