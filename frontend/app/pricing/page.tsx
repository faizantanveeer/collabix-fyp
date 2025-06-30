'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function Contact() {
	return (
		<div className="h-screen overflow-y-hidden flex flex-col">
			<Navbar theme="light" />
			<div className="flex h-screen justify-center items-center">
				<h1>This is Pricing Page</h1>
			</div>
		</div>
	);
}
