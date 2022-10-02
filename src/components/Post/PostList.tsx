import PostItem from "./PostItem";
import {IPostComments} from "../../models/IPost";
import {FC} from "react";

interface PostListProperties {
    posts: IPostComments[],
}

const PostList: FC<PostListProperties> = ({posts}) => {
    return (

        <div style={{maxWidth: 600}}>
            {posts.map(post =>
                <PostItem key={post._id}  post={post}/>
            )}
        </div>
        // <TransitionGroup style={{maxWidth: 600}}>
        // 	{posts.map(post =>
        // 		<CSSTransition
        // 			key={post._id}
        // 			timeout={500}
        // 			classNames={{
        // 				enter: cl.post_enter,
        // 				enterActive: cl.post_enter_active,
        // 				exitActive: cl.post_exit_active
        // 			}}
        // 		>
        // 			<PostItem remove={remove} number={post._id} post={post}/>
        // 		</CSSTransition>
        // 	)}
        // </TransitionGroup>
    );

};

export default PostList;