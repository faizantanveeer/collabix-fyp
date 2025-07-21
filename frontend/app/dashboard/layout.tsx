'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types';
import SidebarLayout from '@/components/SidebarLayout';
import Navbar from '@/components/Navbar';
import { dashboardSidebar } from '@/constants/SidebarItems';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user) {
            router.push('/login');
        } else {
            fetchUserProfile();
        }
    }, [session, status]);

    const fetchUserProfile = async () => {
        try {
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
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    if (!userData) return <div className="text-center mt-20">Loading...</div>;

    return (
    <>
    <Navbar theme='light' />
    <SidebarLayout sidebarItems={dashboardSidebar.influencer} userData={userData}>{children}</SidebarLayout>
    </>
);
}
