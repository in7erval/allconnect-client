import cl from "./Message.module.css";
const userpic = require("../../assets/userpic.jpeg");
import React, {FC, useContext, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import LoadingImage from "../UI/LoadingImage/LoadingImage";
import LoaderForUserPic from "../UI/Loader/LoaderForUserPic";
import LoaderForImage from "../UI/Loader/LoaderForImage";
import IMessage from "../../models/IMessage";

const isSingleEmoji = (stringToCheck: string): boolean => {
    if (!stringToCheck || stringToCheck.length === 0) {
        return false;
    }
    const array = [...stringToCheck];
    if (array.length > 1) return false;
    return /(?=\p{Emoji})(?!\p{Number})/u.test(array[0]);
}

interface MessageProperties {
    message: IMessage;
    onContextMenu: (_event: React.MouseEvent<HTMLDivElement>, _messageId: string) => void;
    highlight: boolean;
    addToSeenBy: (_messageId: string, _userId: string) => void;
    toUserId: string;
}

const Message: FC<MessageProperties>
    = ({
           message,
           onContextMenu,
           highlight,
           addToSeenBy,
           toUserId
       }) => {
    const {store, storeModalImage} = useContext(Context);
    const userId = store.userId;
    if (userId === undefined) return <div>Error: userId is undefined</div>;

    const {ref: reference, inView: isVisible} = useInView({
        threshold: 0.5,
        triggerOnce: true,
        delay: 1000,
        trackVisibility: true
    });

    const isCurrentUserMessage = message.user._id === userId;

    const date = new Date(message.createdAt);
    const stringTime = date.toLocaleTimeString([], {timeStyle: 'short'});

    const tail = message.continuous ? cl.no_tail : "";

    const messageClass = (isCurrentUserMessage ? cl.from_me : cl.from_them) + " " + tail;

    useEffect(() => {
        if (isVisible && !isCurrentUserMessage && !message.seenBy.includes(userId)) {
            addToSeenBy(message._id, userId);
            message.seenBy.push(userId);
        }
    }, [isVisible]);

    // console.log("Render message", message.text, message);

    // console.log("toUserId", toUserId);
    // console.log("isCurrentUserMessage", isCurrentUserMessage);
    // console.log("seenBy", message.seenBy);

    return (
        <div ref={reference}>
            <div
                className={`${cl.message} ${highlight ? cl.highlight : ""}`}
                style={{
                    justifyContent: `${isCurrentUserMessage ? "right" : "left"}`
                }}
            >
                {!isCurrentUserMessage &&
									<LoadingImage
										src={message.user.picture ?? userpic}
										alt="Изображение недоступно"
										className={message.continuous ? cl.hide : ""}
										showWhenLoading={
                        <div style={{width: 30, height: 30, alignSelf: 'end', zIndex: 1, marginRight: 10}}>
                            {message.continuous ? null : <LoaderForUserPic small={true}/>}
                        </div>
                    }
									/>
                }
                <div
                    onContextMenu={(event_) => onContextMenu(event_, message._id)}
                    className={messageClass + " " + cl.message_content}
                >
                    {!isCurrentUserMessage &&
											<a className={cl.name} href={`/user${message.user._id}`}>{message.user.firstName}</a>}
                    <div className={cl.message_img}>
                        {message.picture &&
													<LoadingImage
														src={message.picture}
														alt="Изображение недоступно"
														showWhenLoading={<LoaderForImage/>}
														onClick={() => storeModalImage.initModal(
                                message.picture,
                                {
                                    firstName: message.user.firstName,
                                    lastName: message.user.lastName,
                                    id: message.user._id,
                                    picture: message.user.picture ?? userpic
                                },
                                "message"
                            )}
													/>
                        }
                        <div>
                            {message.text &&
                                (isSingleEmoji(message.text) ?
                                    <p style={{fontSize: 50}}>{message.text}</p> :
                                    <p>{message.text}</p>)
                            }
                            <div
                                style={{
                                    margin: 0,
                                    // padding: "0 0 0 10px",
                                    fontSize: 11,
                                    alignSelf: "end",
                                    display: "flex"
                                }}
                            >
                                {stringTime}
                                {message.seenBy.includes(isCurrentUserMessage ? toUserId : userId) ?
                                    <i className="bi bi-check-all"></i> :
                                    <i className="bi bi-check"></i>}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default observer(Message);