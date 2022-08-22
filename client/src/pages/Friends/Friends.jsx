import AsideNav from "../../components/AsideNav/AsideNav";
import {useFetching} from "../../hooks/useFetching";
import UserService from "../../API/UserService";
import {useEffect, useMemo, useState} from "react";

import userpic from "../../assets/userpic.jpeg";

import cl from "./Friends.module.css";
import Loader from "../../components/UI/Loader/Loader";
import MyModal from "../../components/UI/MyModal/MyModal";
import MessageInput from "../../components/Message/MessageInput";
import MessageService from "../../API/MessageService";

const createRoomId = (firstId, secondId) => firstId > secondId ? `${firstId}:${secondId}` : `${secondId}:${firstId}`;

const Friends = () => {
	const loggedUserId = localStorage.getItem("userId");

	const [visibleModal, setVisibleModal] = useState(false);
	const [friends, setFriends] = useState([]);
	const [inputName, setInputName] = useState("");
	const [friendTo, setFriendTo] = useState({});

	const [fetchFriends, isLoading, _error] = useFetching(async () => {
		let resp = await UserService.getFullById(loggedUserId);
		setFriends(resp.body?.friends);
	});

	useEffect(() => {
		console.log("fetch friends");
		fetchFriends();
	}, []);

	const filteredFriends = useMemo(() => {
		if (inputName.trim() === "") {
			return friends;
		}
		let inputs = inputName.trim().split(" ");
		let first = null, second = null;
		console.log(inputs, inputs.length);
		if (inputs.length > 2) {
			return [];
		}
		if (inputs.length > 1) {
			first = inputs[0].toLowerCase();
			second = inputs[1].toLowerCase();
		} else if (inputs.length === 1) {
			first = inputs[0].toLowerCase();
		}
		return friends.filter(friend => {
			let firstName = friend.firstName.toLowerCase();
			let lastName = friend.lastName.toLowerCase();
			if (first !== null && second !== null) {
				if (firstName.includes(first) && lastName.includes(second)) {
					return true;
				}
				if (firstName === second && lastName === first) {
					return true;
				}
			}
			if (first !== null && second === null && (firstName.includes(first) || lastName.includes(first))) {
				return true;
			}
			if (first === null && second !== null && (firstName.includes(second) || lastName.includes(second))) {
				return true;
			}
			return false;
		})
	}, [friends, inputName]);

	return (
		<div className="default_page">
			<AsideNav/>
			<div className="default_page__content">
				<div className={cl.friends}>
					{isLoading ? <Loader/> :
						<div className={cl.main}>
							<div className={cl.main__header}>
								<div>
									<div>
										<div className={cl.main__header_info}>
											Все друзья <span>{friends?.length}</span>
										</div>
									</div>
								</div>
								<button>
									Найти друзей
								</button>
							</div>
							<form className={cl.main__form}>
								<i className="bi bi-search"></i>
								<input
									type="text"
									src={inputName}
									onChange={event_ => setInputName(event_.target.value)}
									placeholder="Поиск друзей"
								/>
							</form>
							<div className={cl.main__friends}>
								{filteredFriends?.map(friend => (
									<div key={friend._id} className={cl.main__friends_item}>
										<a href={`/user${friend._id}`}>
											<img src={friend.picture ?? userpic} alt={"pic for " + friend.firstName}/>
										</a>
										<div className={cl.main__friends_item__info}>
											<a href={`/user${friend._id}`}>
												<p><b>{friend.firstName} {friend.lastName}</b></p>
											</a>
											<div>
												<button onClick={() => {
													setFriendTo(friend);
													setVisibleModal(true);
												}}>Написать сообщение
												</button>
											</div>
										</div>
									</div>

								))}

							</div>

						</div>
					}
					<MyModal setVisible={setVisibleModal} visible={visibleModal}>
						<div className={cl.modal}>
							<a href={`/user${friendTo._id}`}>
								<div className={cl.modal_header}>
									<img src={friendTo.picture ?? userpic} alt={"pic for " + friendTo.firstName}/>
									<p><b>{friendTo.firstName} {friendTo.lastName}</b></p>
								</div>
							</a>
							<div className={cl.modal_message}>
								<MessageInput sendMessage={(message) => {
									console.log("addMessage", message);
									MessageService.addMessage({
										user: loggedUserId,
										text: message.text,
										roomId: createRoomId(friendTo._id, loggedUserId)
									});
								}}
								/>
							</div>
							<div className={cl.modal_link}>
								<a href={`/messages/${createRoomId(friendTo._id, loggedUserId)}`}>
									К диалогу
								</a>
							</div>
						</div>
					</MyModal>
					{/*<div className={cl.nav}>*/}
					{/*	<ul>*/}
					{/*		<li>Первое</li>*/}
					{/*		<li>Второе</li>*/}
					{/*		<li>Третье</li>*/}
					{/*	</ul>*/}

					{/*</div>*/}
				</div>
			</div>
		</div>
	);
};

export default Friends;