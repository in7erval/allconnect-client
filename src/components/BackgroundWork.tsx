import {useContext, useEffect} from 'react';
import {Context} from "../index";
import useUser from "../hooks/useUser";
import MessageService from "../API/MessageService";
import {observer} from "mobx-react-lite";
import NotificationService from "../API/NotificationService";

const BackgroundWork = () => {
	const {store} = useContext(Context);
	const loggedUserId = store.userId;
	if (loggedUserId === undefined) return <div>Error: loggedUserId is undefined</div>
	const LIMIT_NOTIFICATIONS = 1000;

	const {users} = useUser(loggedUserId);

	useEffect(() => {
		store.setOnlineUsers(users);
	}, [users]);

	useEffect(() => {
		initUnreadMessages();
		initNotifications();
		subscribeForUnreadMessages();
		subscribeForNotifications();
	}, []);

	const initUnreadMessages = async () => {
		const response = await MessageService.getUnreadInit(loggedUserId)
			.catch(error => store.addError(error));
		if (response?.data && response.data.length >= 0) {
			store.setUnreadMessages(response.data);
		}
	};

	const subscribeForUnreadMessages = async () => {
		try {
			const response = await MessageService.getUnread(loggedUserId)
				.catch(error => store.addError(error));
			if (response?.data && response.data.length >= 0) {
				store.setUnreadMessages(response.data.data);
			}
			await subscribeForUnreadMessages();
		} catch (_error) {
			console.error(_error);
			store.addError(_error);
			setTimeout(() => {
				subscribeForUnreadMessages()
			}, 500);
		}
	}

	const initNotifications = async () => {
		const notifications = await NotificationService.getAllById(loggedUserId, LIMIT_NOTIFICATIONS, 1);
		if (notifications?.data?.body && notifications.data.body.length >= 0) {
			store.setNotifications(notifications.data.body);
		}
	}

	const subscribeForNotifications = async () => {
		try {
			const {data} = await NotificationService.getOne(loggedUserId);
			if (data) {
				store.addNotification(data);
			}
			await subscribeForNotifications();
		} catch (_error) {
			console.error(_error);
			store.addError(_error);
			setTimeout(() => {
				subscribeForNotifications()
			}, 500);
		}
	}

	return (
		<></>
	);
};

export default observer(BackgroundWork);