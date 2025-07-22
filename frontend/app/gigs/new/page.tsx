import CreateGigForm from '@/components/CreateGigForm';

export default function NewGigPage() {
	return (
		<>
			<h1 className="text-2xl font-medium">Create a New Gig</h1>
			<div className="mt-4 ">
				<CreateGigForm />
			</div>
		</>
	);
}
