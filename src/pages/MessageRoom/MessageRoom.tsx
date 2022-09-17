import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import MessageInput from "../../components/Message/MessageInput";
import Message from "../../components/Message/Message";
import cl from "./MessageRoom.module.css";
import MessageContextMenu from "../../components/Message/MessageContextMenu/MessageContextMenu";
import useChat from "../../hooks/useChat";
import {Link, useParams} from "react-router-dom";
import {useFetching} from "../../hooks/useFetching";
import UserService from "../../API/UserService";
import Loader from "../../components/UI/Loader/Loader";
import Status from "../../components/UI/Status/Status";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import LoadingImage from "../../components/UI/LoadingImage/LoadingImage";
import LoaderForUserPic from "../../components/UI/Loader/LoaderForUserPic";
import IMessage from "../../models/IMessage";
import IUser from "../../models/IUser";

const userpic = require("../../assets/userpic.jpeg");

const datetimeToDate = (datetime: string) => new Date(datetime).toLocaleDateString();


const groupMessages = (messages: IMessage[]): Map<string, IMessage[]> => {
    const messagesMap = new Map();

    for (const element of messages) {
        const date = datetimeToDate(element.createdAt);
        const newElement = {...element, continuous: false};
        if (messagesMap.has(date)) {
            messagesMap.get(date).push(newElement);
        } else {
            messagesMap.set(date, [newElement]);
        }
    }

    for (const elements of messagesMap.values()) {
        elements.sort((firstElement: IMessage, secondElement: IMessage) => {
            const firstDate: Date = new Date(firstElement.createdAt);
            const secondDate: Date = new Date(secondElement.createdAt);
            return firstDate.getTime() - secondDate.getTime();
        });
    }

    for (const messagesValue of messagesMap.values()) {
        if (messagesValue.length > 1) {
            for (let index = 0; index < messagesValue.length - 1; index++) {
                if (messagesValue[index].user._id === messagesValue[index + 1].user._id) {
                    messagesValue[index].continuous = true;
                }
            }
        }
    }

    return messagesMap;
}


const parseMessageRoomId = (messageRoomId?: string): string[] => {
    return messageRoomId === undefined ? [] : messageRoomId.split(":");
}

const MessageRoom = () => {

    const {id: pageId} = useParams();
    if (pageId === undefined) {
        return <div>Error! PageId is undefined</div>;
    }
    const {store} = useContext(Context);
    const loggedUserId = store.userId;
    const [id1, id2] = parseMessageRoomId(pageId);
    const toUserId: string = (loggedUserId === id1) ? id2 : id1;

    const messagesEndReference = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const {messages, sendMessage, removeMessage, addToSeenBy} = useChat(pageId);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const contextMenuReference = useRef<HTMLDivElement>(null);
    const [clickedMessageReference, setClickedMessageReference] = useState<HTMLDivElement | null>(null);
    const [contextMenuFor, setContextMenuFor] = useState<string>('');

    const messagesMap = useMemo<Map<string, IMessage[]>>(() => groupMessages(messages), [messages]);

    useEffect(() => {
        // eslint-disable-next-line no-undef
        document.title = "Сообщения";
    });

    useEffect(() => {
        // eslint-disable-next-line no-undef
        setTimeout(scrollToBottom, 500);
    }, [messagesMap]);

    // useEffect(() => {
    // 	scrollToBottom();
    // }, []);

    const {
        fetching: fetchUserTo,
        isLoading: isLoadingUserTo,
        error: _error
    } = useFetching(async () => {
        await UserService.getFullById(toUserId)
            .then(response => setUser(response.data))
            .catch(error => store.addError(error));
    });

    useEffect(() => {
        fetchUserTo();
    }, []);

    const scrollToBottom = () => {
        messagesEndReference.current?.scrollIntoView({behavior: 'smooth'});
    }

    const onContextMenu = (event_: React.MouseEvent<HTMLDivElement>, messageId: string) => {
        event_.preventDefault();
        setClickedMessageReference(event_.currentTarget);
        setContextMenuFor(messageId);
        setShowContextMenu(true);
    };

    return (
        <div className={cl.main}>
            {isLoadingUserTo || !user ?
                <div style={{
                    display: "flex",
                    justifyContent: 'center',
                    marginTop: 50
                }}>
                    <Loader/>
                </div>
                :
                <div style={{flex: 1, position: 'relative'}} onClick={() => setShowContextMenu(false)}>
                    <Link to={`/user${user._id}`} style={{color: "black"}}>
                        <div className={cl.to_user_card}>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-evenly"}}>
                                {user.lastName} {user.firstName}
                                <div style={{marginLeft: 10}}>
                                    <Status userId={user._id}/>
                                </div>
                            </div>
                            <LoadingImage
                                showWhenLoading={<LoaderForUserPic/>}
                                src={user.picture ?? userpic}
                                alt="Изображение недоступно"
                            />
                        </div>
                    </Link>
                    <div className={cl.messages}>
                        <div className={cl.down}>
                            <button type="button" onClick={() => scrollToBottom()}>
                                <i className="bi bi-caret-down-square-fill"></i>
                            </button>
                        </div>
                        {messages && messages.length > 0 && [...messagesMap.keys()].map(key =>
                            (<div key={key}>
                                    <div className={cl.message_date}>
                                        {key}
                                    </div>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {//@ts-ignore
                                        messagesMap.get(key).map(element => (
                                            <Message
                                                key={element._id}
                                                message={element}
                                                onContextMenu={onContextMenu}
                                                highlight={showContextMenu && contextMenuFor === element._id}
                                                addToSeenBy={addToSeenBy}
                                                toUserId={toUserId}
                                            />
                                        ))}
                                </div>
                            )
                        )
                        }
                        <div ref={messagesEndReference}/>
                        <MessageContextMenu
                            isActive={showContextMenu}
                            reference={contextMenuReference}
                            message={clickedMessageReference}
                            liMap={[
                                // {onClick: () => console.log("delete me"), text: "Удалить у меня", isDanger: true},
                                {onClick: () => removeMessage(contextMenuFor), text: "Удалить у всех", isDanger: true}
                                // {onClick: () => () => setShowContextMenu(false), text: "Закрыть", isDanger: false}
                            ]}
                        />
                    </div>
                    <div>
                        <MessageInput
                            sendMessage={sendMessage}
                            message={{user: loggedUserId, roomId: pageId}}
                        />
                    </div>

                </div>
            }
        </div>
    );
};
export default observer(MessageRoom);