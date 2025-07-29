import React from 'react';
import Navbar from '@/components/Navbar';
import ExploreGigsPage from '@/components/ExploreGigsPage';
import ShortFooter from '@/components/ShortFooter';

const ExploreGigs = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar theme="light" />

			{/* Main content fills remaining height */}
			<div className="flex-grow flex flex-col">
				<ExploreGigsPage  />
			</div>

			{/* Footer sticks to the bottom */}
			<ShortFooter />
		</div>
	);
};

export default ExploreGigs;
