import { UserData } from '@/types';

interface NotificationsProps {
	userData: UserData | null;
}

const Notifications = ({ userData }: NotificationsProps) => {
	return <h1 className="text-2xl font-bold">Notifications</h1>;
};

export default Notifications;
