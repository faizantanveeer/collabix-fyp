'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export default function ChatbotWidget() {
	const MAX_LINES = 5;

	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const [expandedMessages, setExpandedMessages] = useState<{
		[key: number]: boolean;
	}>({});

	const toggleChat = () => setIsOpen(!isOpen);

	const handleSend = async () => {
		if (!input.trim()) return;

		const newMessage = { sender: 'user', text: input };
		setMessages((prev) => [...prev, newMessage]);
		setInput('');
		setLoading(true);

		try {
			const res = await fetch('http://localhost:5000/chatbot', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: input }),
			});

			const data = await res.json();
			setMessages((prev) => [
				...prev,
				{
					sender: 'bot',
					text: data.reply || 'Sorry, I didn’t understand that.',
				},
			]);
		} catch (err) {
			setMessages((prev) => [
				...prev,
				{ sender: 'bot', text: 'Error connecting to server.' },
			]);
		}

		setLoading(false);
	};

	const toggleExpand = (index: number) => {
		setExpandedMessages((prev) => ({ ...prev, [index]: !prev[index] }));
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		if (isOpen && messages.length === 0) {
			setMessages([
				{
					sender: 'bot',
					text: 'Hey there! 👋 How can I help you today?',
				},
			]);
		}
	}, [isOpen]);

	return (
		<>
			{/* Floating Button */}
			<div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-2">
				{/* Pulsating Circle */}
				<div className="relative flex items-center justify-center">
					{/* Pulse ring */}
					<div className="absolute w-12 h-12 rounded-full bg-gray-800 opacity-50 animate-ping transition "></div>

					{/* Chat Button */}
					<button
						onClick={toggleChat}
						className="relative z-10 w-12 h-12 bg-white border border-gray-300 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
					>
						<img
							src="/images/logob.png" // ✅ Ensure this path is correct
							alt="Chatbot Icon"
							className="w-12 h-12 object-cover"
						/>
					</button>
				</div>
			</div>

			{/* Chat Window */}
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					className="fixed bottom-24 right-6 z-50 w-96 max-h-[80vh] bg-white rounded-2xl border shadow-2xl flex flex-col overflow-hidden" // 👈 added `overflow-hidden` to make rounded corners clean
				>
					{/* Header */}
					<div className="bg-gray-900 flex items-center justify-between text-white px-4 py-3 font-semibold text-lg rounded-t-2xl">
						<div className="flex items-center gap-1">
							<img
								src={'/images/logo.png'}
								alt="Chatbot Icon"
								className="w-10 h-10 object-cover rounded-md"
							/>
							Cola
						</div>

						{/* Minimize Button */}
						<button
							onClick={toggleChat}
							className="text-gray-300 hover:text-white transition"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="2"
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Rest of the Chat Window stays the same */}

					{/* Messages Scrollable Area */}
					<ScrollArea className="flex-1 px-4 py-3 overflow-y-auto h-[400px]">
						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={`flex mb-3 ${
									msg.sender === 'user'
										? 'justify-end'
										: 'justify-start'
								}`}
							>
								<div
									className={`flex items-end gap-2 max-w-[75%]`}
								>
									{msg.sender === 'bot' && (
										<Avatar className="w-8 h-8 ">
											<AvatarFallback>
												<img
													src={
														'../../images/logob.png'
													}
													alt="Campaign Image"
													className=" object-cover h-12 w-12"
												/>
											</AvatarFallback>
										</Avatar>
									)}

									<div
										className={`px-4 py-2 rounded-xl text-sm whitespace-pre-wrap break-words ${
											msg.sender === 'user'
												? 'bg-gray-900 text-white rounded-br-none'
												: 'bg-gray-100 text-gray-900 rounded-bl-none'
										}`}
									>
										<ReactMarkdown
											rehypePlugins={[rehypeRaw]}
											remarkPlugins={[remarkGfm]}
											components={{
												strong: ({
													node,
													...props
												}) => (
													<strong
														className="font-bold"
														{...props}
													/>
												),
											}}
										>
											{expandedMessages[idx] ||
											msg.text.split('\n').length <=
												MAX_LINES
												? msg.text
												: msg.text
														.split('\n')
														.slice(0, MAX_LINES)
														.join('\n') + '...'}
										</ReactMarkdown>

										{msg.text.split('\n').length >
											MAX_LINES && (
											<button
												onClick={() =>
													toggleExpand(idx)
												}
												className="text-xs text-blue-500 mt-1 hover:underline"
											>
												{expandedMessages[idx]
													? 'Show less'
													: 'Read more'}
											</button>
										)}
									</div>

									{msg.sender === 'user' && (
										<Avatar className="w-8 h-8 border">
											<AvatarFallback>
												<img
													src={
														'../../images/placeholder.png'
													}
													alt="Campaign Image"
													className="w-7 h-7 object-cover"
												/>
											</AvatarFallback>
										</Avatar>
									)}
								</div>
							</div>
						))}

						{loading && (
							<div className="text-gray-500 text-sm">
								Colla is typing...
							</div>
						)}

						<div ref={messagesEndRef} />
					</ScrollArea>

					{/* Input Area */}
					<div className="border-t px-3 py-2 flex gap-2 items-center bg-white">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSend()}
							placeholder="Type a message..."
							className="text-sm"
						/>
						<Button
							onClick={handleSend}
							className="bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-full"
							size="icon"
						>
							<Send size={16} />
						</Button>
					</div>
				</motion.div>
			)}
		</>
	);
}
