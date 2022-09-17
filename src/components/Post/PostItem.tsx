import {FC, useContext, useEffect, useState} from 'react';
import Comments from "./Comments/Comments";
import cl from "./Post.module.css";

import 'bootstrap-icons/font/bootstrap-icons.css';
import PostService from "../../API/PostService";
import {Link} from "react-router-dom";
import Status from "../UI/Status/Status";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import LoadingImage from "../UI/LoadingImage/LoadingImage";
import LoaderForUserPic from "../UI/Loader/LoaderForUserPic";
import LoaderForImage from "../UI/Loader/LoaderForImage";
import IPost from "../../models/IPost";

interface PostItemProperties {
    post: IPost;
}

const PostItem: FC<PostItemProperties> = ({post}) => {

    const {store, storeModalImage, storePosts} = useContext(Context);
    const loggedUserId = store.userId;
    const [showComments, setShowComments] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [invertHeartIcon, setInvertHeartIcon] = useState(false); //fixme: это дно, пофикси
    const [isLiked, setIsLiked] = useState(post.likes.includes(loggedUserId));
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [commentsCount, setCommentsCount] = useState(post.comments.length);

    // console.log("comments", post.comments);

    useEffect(() => {
        setIsOwner(loggedUserId === post.owner._id);
    }, []);

    const addOrRemoveLike = async () => {
        if (isLiked) {
            await PostService.deleteLike(post._id, loggedUserId).catch(error => store.addError(error));
            setLikesCount(likesCount - 1);
        } else {
            await PostService.addLike(post._id, loggedUserId).catch(error => store.addError(error));
            setLikesCount(likesCount + 1);
        }
        setIsLiked(!isLiked);
        setInvertHeartIcon(false);
    }

    return (<div className={cl.post}>
            <Link to={`/user${post.owner._id}`}>
                <div className={cl.post__owner}>
                    <LoadingImage
                        src={post.owner.picture}
                        alt="Изображение недоступно"
                        showWhenLoading={
                            <div style={{marginRight: 10}}>
                                <LoaderForUserPic/>
                            </div>
                        }/>
                    {/*<img />*/}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "flex-start",
                            height: "50px"
                        }}>
                        <p>
                            {`${post.owner.firstName} ${post.owner.lastName}`}
                        </p>
                        <Status userId={post.owner._id}/>
                    </div>
                </div>
            </Link>
            <div>
                <div className={cl.post__publish_date}>
                    {new Date(post.publishDate).toLocaleString()}
                </div>
                <div className={cl.post__content}>
                    {post.image &&
											<LoadingImage
												src={post.image}
												alt="Pic"
												showWhenLoading={<LoaderForImage/>}
												onClick={() =>
                            storeModalImage.initModal(post.image,
                                {
                                    firstName: post.owner.firstName,
                                    lastName: post.owner.lastName,
                                    id: post.owner._id,
                                    picture: post.owner.picture
                                })
                        }
											/>}
                    <div>
                        {post.text}
                    </div>
                </div>
            </div>

            {showComments &&
							<Comments
								postId={post._id}
								setCommentsCount={setCommentsCount}
							/>
            }
            <div className={cl.post__btns}>
                {/*<MyButton onClick={() => props.remove(props.post)}>*/}
                {/*	Удалить*/}
                {/*</MyButton>*/}
                <div className={cl.post__btns__like_comment}>
                    <button className={cl.post__btns__like}
                            onMouseEnter={_event => setInvertHeartIcon(true)}
                            onMouseLeave={_event => setInvertHeartIcon(false)}
                            onClick={addOrRemoveLike}
                    >
                        {isLiked ?
                            (!invertHeartIcon ?
                                <i className={"bi bi-heart-fill " + cl.heart_fill + " " + cl.bi_heart_fill_color}></i> :
                                <i className={"bi bi-heart"}></i>)
                            :
                            (!invertHeartIcon ?
                                    <i className={"bi bi-heart"}></i> :
                                    <i className={"bi bi-heart-fill " + cl.heart_fill + " " + cl.bi_heart_fill_color}></i>
                            )
                        }
                        <div style={{marginLeft: '5px'}}>
                            {likesCount}
                        </div>

                    </button>
                    <button onClick={() => setShowComments(!showComments)}>
                        <i className="bi bi-chat-left-dots"></i>
                        <div style={{marginLeft: '5px'}}>
                            {commentsCount}
                        </div>
                    </button>
                </div>
                {isOwner && <button onClick={async () => {
                    await PostService.delete(post._id);
                    storePosts.setReloadPosts(true);
                }} className={cl.post__btns_btn_delete}>
									Удалить
								</button>
                }
            </div>
        </div>
    );
};

export default observer(PostItem);