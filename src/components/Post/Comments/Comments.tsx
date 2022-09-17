import {FC, useContext, useEffect, useMemo, useRef, useState} from 'react';
import Comment from "./Comment";
import cl from './Comment.module.css';
import TextareaAutosize from "react-textarea-autosize";
import CommentsService from "../../../API/CommentsService";
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import IComment from "../../../models/IComment";

const arrow = require("../../../assets/send.svg");

const datetimeToDate = (datetime: string) => new Date(datetime).toLocaleDateString();

const sortDate = (date1: Date | string, date2: Date | string): number => {
    return new Date(date1).getTime() - new Date(date2).getTime();
}

const sortDateParsed = (dateString1: string, dateString2: string): number => {
    const firstDate = Date.parse(dateString1.replace('.', '-'));
    const secondDate = Date.parse(dateString2.replace('.', '-'));
    return firstDate - secondDate;
}

const groupComments = (comments: IComment[]): Map<string, IComment[]> => {
    const commentsMap = new Map();

    for (const element of comments) {
        const date = new Date(element.publishDate).toDateString();
        const newElement = {...element, continuous: false};
        if (commentsMap.has(date)) {
            commentsMap.get(date).push(newElement);
        } else {
            commentsMap.set(date, [newElement]);
        }
    }

    for (const elements of commentsMap.values()) {
        elements.sort((firstElement: IComment, secondElement: IComment) => {
            return sortDate(firstElement.publishDate, secondElement.publishDate);
        });
    }

    for (const commentsValue of commentsMap.values()) {
        if (commentsValue.length > 1) {
            for (let index = 0; index < commentsValue.length - 1; index++) {
                if (commentsValue[index].owner._id === commentsValue[index + 1].owner._id) {
                    commentsValue[index].continuous = true;
                }
            }
        }
    }

    return commentsMap;
}

interface CommentsProperties {
    postId: string;
    setCommentsCount: (_count: number) => void;
}

const Comments: FC<CommentsProperties> =
    ({
         postId,
         setCommentsCount
     }) => {

        const {store} = useContext(Context);
        const [commentMessage, setCommentMessage] = useState("");
        const referenceComments = useRef<HTMLDivElement>(null);

        const [comments, setComments] = useState<IComment[]>([]);

        // const {comments, sendComment, _removeComment} = useComments(postId);

        useEffect(() => {
            initComments();
            subscribe()
        }, []);

        const initComments = async () => {
            const {data} = await CommentsService.getAll(postId);
            setComments(data.body);
        }

        const subscribe = async () => {
            try {
                const {data}  = await CommentsService.getOne(postId);
                console.log(data);
                setComments(previous => [data.body, ...previous]);
                console.log("getOne, subscribe again");
                setTimeout(() => {
                    subscribe()
                }, 100);
            } catch (_error) {
                console.error(_error);
                setTimeout(() => {
                    subscribe()
                }, 500);
            }
        }

        const sendComment = async (comment: string) => {
            await CommentsService.add({
                text: comment,
                userId: store.userId,
                postId
            }).catch(error => store.addError(error));
        }

        const sendCommentAction = () => {
            if (commentMessage !== "") {
                sendComment(commentMessage);
                setCommentMessage("");
            }
        };

        const scrollToBottom = () => {
            if (referenceComments.current) {
                referenceComments.current.scrollTop = referenceComments.current.scrollHeight;
            }
        }

        useEffect(() => {
            // скролл до низа при рендере
            scrollToBottom();
        }, []);

        useEffect(() => {
            console.log("comments.length", comments.length);
            setCommentsCount(comments.length);
            scrollToBottom();
        }, [comments]);

        const commentsMap = useMemo<Map<string, IComment[]>>(() => groupComments(comments), [comments]);

        return (
            <div>
                {comments.length > 0 &&
									<div className={cl.comments} ref={referenceComments}>

                      {[...commentsMap.keys()].sort(sortDateParsed).map(key =>
                          (<div key={key}>
                                  <div className={cl.comment_date}>
                                      {datetimeToDate(key)}
                                  </div>
                                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                  {// @ts-ignore
                                      commentsMap.get(key).map(element => (
                                      <Comment
                                          key={element._id}
                                          ownerId={element.owner._id}
                                          pic={element.owner.picture}
                                          firstName={element.owner.firstName}
                                          lastName={element.owner.lastName}
                                          message={element.message}
                                          publishDate={element.publishDate}
                                          continuous={element.continuous}
                                      />
                                  ))}
                              </div>
                          )
                      )}
									</div>
                }

                <div className={cl.comment__msg}>
                    <TextareaAutosize
                        value={commentMessage}
                        placeholder="Напиши что думаешь об этом..."
                        onChange={event_ => {
                            setCommentMessage(event_.target.value);
                        }}
                        onKeyPress={(event_) => {
                            if (event_.code === "Enter" && !event_.shiftKey) {
                                console.log("send comment!");
                                event_.preventDefault();
                                sendCommentAction();
                            }
                        }}
                    />
                    <button className={cl.comment__msg_img} onClick={sendCommentAction}>
                        <img src={arrow} alt="send"/>
                    </button>
                </div>
            </div>
        );
    };

export default observer(Comments);