import React from 'react';

const ShortFooter = () => {
	return (
		<div className="md:px-16 item-center  flex flex-col item-center justify-center pt-8 text-white bg-gray-900 w-full">
			<div className="w-full flex flex-col h-44 md:flex-row items-center  justify-between gap-10">
				<img
					src="/images/logo.png"
					alt="Collabix Logo"
					className="w-32 md:w-40  "
				/>

				<div className="flex flex-col sm:flex-row justify-between  w-full gap-10">
					<div>
						<h4 className="text-lg font-semibold mb-4">
							Quick Links
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-white/80 hover:underline"
								>
									Try Collabix
								</a>
							</li>
							<li>
								<a
									href="/#"
									className="text-white/80 hover:underline"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href="/term#s"
									className="text-white/80 hover:underline"
								>
									Terms & Conditions
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-4">
							Contact Us
						</h4>
						<p className="text-white/70 mb-1">
							Issues? Email us at:
						</p>
						<a
							href="mailto:info2mypath@gmail.com"
							className="underline text-white"
						>
							info@collabix.com
						</a>
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div className="text-sm text-gray-500 text-center mt-8 ">
				© 2025 Collabix. All rights reserved.
			</div>
		</div>
	);
};

export default ShortFooter;
