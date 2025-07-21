// app/context/UserContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserData } from '@/types';

export const UserContext = createContext<UserData | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: session, status } = useSession();
	const [userData, setUserData] = useState<UserData | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			if (status === 'authenticated' && session?.accessToken) {
				const res = await fetch('http://localhost:5000/dashboard', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${session.accessToken}`,
					},
					credentials: 'include',
				});

				const data = await res.json();
				setUserData(data);
			}
		};

		fetchUser();
	}, [session, status]);

	return (
		<UserContext.Provider value={userData}>{children}</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
