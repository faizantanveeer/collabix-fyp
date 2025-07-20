'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/nprogress.css'; // custom styles

export default function NProgressProvider() {
	const pathname = usePathname();

	useEffect(() => {
		NProgress.start();
		NProgress.set(0.4); // optional: start partially
		NProgress.done();
	}, [pathname]);

	return null;
}
