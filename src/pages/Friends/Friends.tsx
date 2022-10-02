import {IUseFetching, useFetching} from "../../hooks/useFetching";
import UserService from "../../API/UserService";
import {useContext, useEffect, useMemo, useState} from "react";

const userpic = require("../../assets/userpic.jpeg");
import cl from "./Friends.module.css";

import Loader from "../../components/UI/Loader/Loader";
import DefaultModal from "../../components/UI/DefaultModal/DefaultModal";
import MessageInput from "../../components/Message/MessageInput";
import MessageService from "../../API/MessageService";
import {Link, useParams} from "react-router-dom";
import Status from "../../components/UI/Status/Status";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import LoadingImage from "../../components/UI/LoadingImage/LoadingImage";
import LoaderForUserPic from "../../components/UI/Loader/LoaderForUserPic";
import IUser from "../../models/IUser";

const createRoomId = (firstId: string, secondId: string): string => firstId > secondId ? `${firstId}:${secondId}` : `${secondId}:${firstId}`;

const Friends = () => {
    const {store} = useContext(Context);
    const loggedUserId = store.userId;
    if (loggedUserId === undefined) return <div>Error: loggedUserId is undefined</div>;
    const parameters = useParams();
    const pageUserId = parameters.id ?? loggedUserId;

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [friends, setFriends] = useState<IUser[]>([]);
    const [inputName, setInputName] = useState<string>("");
    const [friendTo, setFriendTo] = useState<IUser | null>(null);
    const [isGlobal, setIsGlobal] = useState(false);

    useEffect(() => {
        document.title = `Друзья`;
    });

    const {fetching: fetchFriends, isLoading, error: _error}: IUseFetching =
        useFetching(async () => {
            if (!isGlobal) {
                const resp = await UserService.getFullById(pageUserId).catch(error => store.addError(error));
                setFriends(resp?.data?.friends);
            } else {
                // todo: pagination (затык с фильтрацией на фронте, перенести в back)
                const resp = await UserService.getAll(1000, 1).catch(error => store.addError(error));
                setFriends(resp?.data?.body);
            }
        });

    useEffect(() => {
        fetchFriends();
    }, [isGlobal]);

    const filteredFriends = useMemo(() => {
        if (inputName.trim() === "") {
            return friends;
        }
        const inputs = inputName.trim().split(" ");
        let first: string | null = null;
        let second: string | null = null;
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
            const firstName: string = friend.firstName.toLowerCase();
            const lastName: string = friend.lastName.toLowerCase();
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
        <div className={cl.friends}>
            {isLoading ? <Loader/> :
                <div className={cl.main}>
                    <div className={cl.main__header}>
                        <div>
                            <div>
                                <div className={cl.main__header_info}>
                                    Все {isGlobal ? "люди" : "друзья"} <span>{friends?.length}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsGlobal(!isGlobal)} className={isGlobal ? cl.active : ""}>
                            Найти друзей
                        </button>
                    </div>
                    <form className={cl.main__form}>
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            src={inputName}
                            onChange={event_ => setInputName(event_.target.value)}
                            placeholder={(isGlobal ? "Глобальный п" : "П") + "оиск друзей"}
                        />
                    </form>
                    <div className={cl.main__friends}>
                        {filteredFriends?.map(friend => (
                            <div key={friend._id} className={cl.main__friends_item}>
                                <Link to={`/user${friend._id}`}>
                                    <LoadingImage
                                        src={friend.picture ?? userpic}
                                        alt="Изображение недоступно"
                                        showWhenLoading={<LoaderForUserPic/>}
                                    />
                                </Link>
                                <div className={cl.main__friends_item__info}>
                                    <Link to={`/user${friend._id}`}>
                                        <p><b>{friend.firstName} {friend.lastName}</b></p>
                                    </Link>
                                    <Status userId={friend._id}/>
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
            <DefaultModal setVisible={setVisibleModal} visible={visibleModal}>
                {friendTo !== null ?
                    <div className={cl.modal}>
                        <Link to={`/user${friendTo._id}`}>
                            <div className={cl.modal_header}>
                                <LoadingImage
                                    src={friendTo.picture ?? userpic}
                                    alt={"pic for " + friendTo.firstName}
                                    showWhenLoading={<LoaderForUserPic/>}
                                />
                                <p><b>{friendTo.firstName} {friendTo.lastName}</b></p>
                            </div>
                        </Link>
                        <div className={cl.modal_message}>
                            <MessageInput
                                sendMessage={(message) => MessageService.addMessage(message)}
                                message={{user: loggedUserId, roomId: createRoomId(friendTo._id, loggedUserId)}}
                            />
                        </div>
                        <div className={cl.modal_link}>
                            <Link to={`/messages/${createRoomId(friendTo._id, loggedUserId)}`}>
                                К диалогу
                            </Link>
                        </div>
                    </div>
                    :
                    <div>Пользователь не определён</div>
                }
            </DefaultModal>
            {/*<div className={cl.nav}>*/}
            {/*	<ul>*/}
            {/*		<li>Первое</li>*/}
            {/*		<li>Второе</li>*/}
            {/*		<li>Третье</li>*/}
            {/*	</ul>*/}

            {/*</div>*/}
        </div>
    );
};

export default observer(Friends);