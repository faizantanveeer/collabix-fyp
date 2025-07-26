import React from 'react';
import Navbar from '@/components/Navbar';
import ExploreGigsPage from '@/components/ExploreGigsPage';
import ShortFooter from '@/components/ShortFooter';

const ExploreGigs = () => {
	return (
		<div>
			<Navbar theme="light" />
			<div className="mt-16 max-w-6xl mx-auto">
				<ExploreGigsPage />
			</div>
			<ShortFooter/>
			
		</div>
	);
};

export default ExploreGigs;
