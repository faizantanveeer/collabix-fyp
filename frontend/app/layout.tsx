import Providers from './provider';
import { Toaster } from '@/components/ui/sonner';
import '../styles/globals.css'; // Import global styles
import Head from 'next/head';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Head>
				<link rel="preload" as="image" href="/images/logo.png" />
				<link rel="preload" as="image" href="/images/logo2.png" />
			</Head>
			<body>
				<Providers>
					{' '}
					{/* Wrap with Providers */}
					{children}
					<Toaster richColors position="top-center" />
				</Providers>
			</body>
		</html>
	);
}
