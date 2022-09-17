import cl from "./MessageContextMenu.module.css";
import React, {FC} from "react";

interface ILiMap {
    onClick: () => void;
    text: string;
    isDanger: boolean;
}

interface MessageContextMenuProperties {
    isActive: boolean;
    reference: React.Ref<HTMLDivElement>,
    liMap: ILiMap[];
    message: HTMLDivElement | null;
}

const MessageContextMenu: FC<MessageContextMenuProperties> =
    ({
         isActive,
         reference,
         liMap,
         message
     }) => {
        return (
            <nav className={`${cl.message_content_menu} ${isActive ? cl.message_content_menu_active : ""}`}
                 ref={reference}>
                <ul>
                    {liMap?.map((element, index) =>
                        <li key={index}>
                            <button className={element.isDanger ? cl.danger : ""}
                                    onClick={element.onClick}>{element.text}</button>
                        </li>
                    )}
                    <li>
                        <button onClick={(event) => {
                            message?.scrollIntoView({behavior: "smooth"});
                            event.stopPropagation();
                        }}>Показать сообщение
                        </button>
                    </li>
                    {/*<li><button className={cl.danger}>Удалить у меня</button></li>*/}
                    {/*<li><button className={cl.danger}>Удалить у всех</button></li>*/}
                    {/*<li><button onClick={close}>Закрыть</button></li>*/}
                </ul>
            </nav>
        );
    };

export default MessageContextMenu;