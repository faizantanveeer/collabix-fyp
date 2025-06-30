'use c';
import { useRef } from 'react';

const MagicHoverButton = ({ children, href = '/login' }) => {
	const btnRef = useRef(null);

	const handleMouseMove = (e) => {
		const btn = btnRef.current;
		const rect = btn.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		btn.style.setProperty('--x', `${x}px`);
		btn.style.setProperty('--y', `${y}px`);
	};

	return (
		<a href={href}>
			<button
				ref={btnRef}
				onMouseMove={handleMouseMove}
				className="relative overflow-hidden px-6 py-2 rounded-full border border-white text-white font-semibold backdrop-blur-md transition-all duration-300 group z-10"
			>
				<span className="relative z-10 transition-all duration-300 group-hover:text-gray-900">
					{children}
				</span>
				<span
					className="absolute pointer-events-none -z-10 h-[400%] w-[400%] rounded-full bg-white transition-all duration-500 ease-out"
					style={{
						top: 'var(--y)',
						left: 'var(--x)',
						transform: 'translate(-50%, -50%)',
					}}
				/>
			</button>
		</a>
	);
};

export default MagicHoverButton;
