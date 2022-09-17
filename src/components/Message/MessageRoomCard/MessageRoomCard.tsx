import cl from "./MessageRoomCard.module.css";
const userpic = require("../../../assets/userpic.jpeg");
import Status from "../../UI/Status/Status";
import LoadingImage from "../../UI/LoadingImage/LoadingImage";
import LoaderForUserPic from "../../UI/Loader/LoaderForUserPic";
import IUser from "../../../models/IUser";
import {FC} from "react";

interface MessageRoomCardProperties {
    user: IUser;
    id: string;
    messagePreview: string;
    messageTime: string;
    isUnread: boolean;
}

const MessageRoomCard: FC<MessageRoomCardProperties> =
    ({
         user,
         id,
         messagePreview,
         messageTime,
         isUnread
     }) => {

        if (messagePreview && messagePreview.length > 50) {
            messagePreview = messagePreview.slice(0, 50) + "...";
        }

        if (messageTime) {
            messageTime = (new Date(messageTime)).toLocaleTimeString([], {timeStyle: 'short'});
        }

        const classname = cl.message_card + (isUnread ? ` ${cl.unread} ` : " ") + (messagePreview ? "" : cl.no_messages);

        return (
            <div className={classname} key={id}>
                <LoadingImage
                    showWhenLoading={
                        <div style={{marginRight: 20}}>
                            <LoaderForUserPic/>
                        </div>
                    }
                    src={user.picture ?? userpic}
                    alt="Изображение недоступно"
                />
                <div className={cl.message_card_name}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <p>{user.lastName} {user.firstName}</p>
                        <div style={{marginLeft: 10}}>
                            <Status userId={user._id}/>
                        </div>
                    </div>
                    <p className={cl.message_preview}>{messagePreview}</p>

                </div>
                <div className={cl.message_time}>
                    <p>{messageTime}</p>
                </div>
            </div>
        );
    };

export default MessageRoomCard;