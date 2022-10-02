import {SERVER_URI} from '../constants';
import {useEffect, useRef, useState} from 'react'
import {io} from 'socket.io-client'

export default function useUser(userId: string | null) {
	const [users, setUsers] = useState([]);


	const {current: socket} = useRef(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		io(SERVER_URI, {
			query: {
				userId: userId,
				action: "connect"
			}
		})
	);

	useEffect(() => {
		socket.emit('users:get');

		socket.on('users_list:update', (users) => {
			console.log(`setUsers() ${new Date().toString()}`, users, users.length);
			setUsers(users);
		});
	}, []);

	return {users};
}