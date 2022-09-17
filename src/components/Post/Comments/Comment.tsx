import cl from './Comment.module.css';
import {Link} from "react-router-dom";
import {FC, useContext} from "react";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";

interface CommentProperties {
    pic: string;
    ownerId: string;
    firstName: string;
    lastName: string;
    message: string;
    publishDate: string;
    continuous: boolean;
}

const Comment: FC<CommentProperties> =
    ({
         pic,
         ownerId,
         firstName,
         lastName,
         message,
         publishDate,
         continuous
     }) => {

        const {store} = useContext(Context);
        const currentUserId = store.userId;

        const isCurrentUserComment = ownerId === currentUserId;

        const tail = continuous ? cl.no_tail : "";

        const commentClass = (isCurrentUserComment ? cl.from_me : cl.from_them) + " " + tail;
        const date = new Date(publishDate);
        const stringTime = date.toLocaleTimeString([], {timeStyle: 'short'});

        return (
            <div className={`${cl.comment} ${commentClass}`}>
                {!isCurrentUserComment &&
									<img
										src={pic}
										alt="Изображение недоступно"
										className={continuous ? cl.hide : ""}
									/>
                }
                <p className={commentClass}>
                    <Link className={cl.name} to={`/user${ownerId}`}>{firstName + " " + lastName}</Link>
                    <span>
					{message}
                        <span
                            style={{
                                margin: 0,
                                padding: "0 0 0 10px",
                                fontSize: 11,
                                alignSelf: "end",
                                display: "flex"
                            }}
                        >
							{stringTime}
						</span>
				</span>
                </p>
            </div>
        );
    };
export default observer(Comment);