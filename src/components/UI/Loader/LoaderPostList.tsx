import clPost from "../../Post/Post.module.css";
import cl from "./Loader.module.css";
import {Link} from "react-router-dom";
import LoaderForUserPic from "./LoaderForUserPic";
import LoaderForImage from "./LoaderForImage";
import LoaderText from "./LoaderText";

const LoaderPostItem = () => {
	return (
		<div className={clPost.post}>
			<Link to={`#`}>
				<div className={clPost.post__owner}>
					<LoaderForUserPic/>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-evenly",
							alignItems: "center",
							height: "50px",
							alignSelf: 'flex-end',
							flex: 1
						}}>
						<LoaderText/>
						<LoaderText/>
					</div>
				</div>
			</Link>
			<div>
				<div className={clPost.post__publish_date} style={{
					display: 'flex',
					justifyContent: 'flex-end'
				}}>
					<LoaderText/>
					{/*{new Date(post.publishDate).toLocaleString()}*/}
				</div>
				<div className={clPost.post__content}>
					<LoaderForImage/>
				</div>
			</div>
			<div className={clPost.post__btns}>
				{/*<MyButton onClick={() => props.remove(props.post)}>*/}
				{/*	Удалить*/}
				{/*</MyButton>*/}
				<div className={clPost.post__btns__like_comment}>
					<button className={clPost.post__btns__like}>
						<i className={"bi bi-heart"}></i>
						<div style={{marginLeft: '5px', width: 50}} className={cl.loader_text}>
							{/*10000*/}
						</div>

					</button>
					<button>
						<i className="bi bi-chat-left-dots"></i>
						<div style={{marginLeft: '5px', width: 50}} className={cl.loader_text}>
							{/*10000*/}
						</div>
					</button>
				</div>
			</div>
		</div>
	)
};


const LoaderPostList = () => {
	return (
		<div style={{maxWidth: 600}}>
			<LoaderPostItem/>
			<LoaderPostItem/>
			<LoaderPostItem/>
		</div>
	);
};

export default LoaderPostList;