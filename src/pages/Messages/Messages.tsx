import {useContext, useEffect, useState} from 'react';
import {useFetching} from "../../hooks/useFetching";
import MessageRoomCard from "../../components/Message/MessageRoomCard/MessageRoomCard";

import cl from "./Messages.module.css";
import MessageService from "../../API/MessageService";
import {Link} from "react-router-dom";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import MessageRoomCardLoader from "../../components/Message/MessageRoomCard/MessageRoomCardLoader";
import IMessage from "../../models/IMessage";

const LoaderMessageRooms = () => {
    return (
        <>
            <Link to={"#"}>
                <MessageRoomCardLoader/>
            </Link>
            <Link to={"#"}>
                <MessageRoomCardLoader/>
            </Link>
            <Link to={"#"}>
                <MessageRoomCardLoader/>
            </Link>
        </>
    )
}

const Messages = () => {
    const [lastMessages, setLastMessages] = useState<IMessage[]>([]);

    const {store} = useContext(Context);
    const loggedUserId = store.userId;
    const unreadMessages = store.unreadMessages;

    const {
        fetching: fetchMessagesForPage,
        isLoading: isLoadingMessages,
        error: _errorMessages
    } = useFetching(async () => {
            await MessageService.getAllRoomsForUser(loggedUserId)
                .then(response => response.data)
                .then(data => {
                    console.log(data);
                    setLastMessages(data);
                })
                .catch(error => store.addError(error));
        })

    useEffect(() => {
        fetchMessagesForPage();
    }, []);

    useEffect(() => {
        document.title = "Сообщения";
    });

    return (
        <div style={{flex: 1, width: "100%", maxWidth: 600}}>
            <div>
                <h2 className={cl.messages_header}>
                    Сообщения
                </h2>

                <div className={cl.messages_rooms}>
                    {isLoadingMessages ? <LoaderMessageRooms/> :
                        lastMessages.map(element => (
                            <Link key={element._id} to={`/messages/${element._id}`}>
                                <MessageRoomCard
                                    user={element.user}
                                    id={element._id}
                                    messagePreview={element.text}
                                    messageTime={element.createdAt}
                                    isUnread={unreadMessages?.some(unreadMessage => unreadMessage.user === element.user._id)}
                                />
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default observer(Messages);