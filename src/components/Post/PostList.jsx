import PostItem from "./PostItem";
import PropTypes from "prop-types";

const PostList = ({posts, remove}) => {
	return (

		<div style={{maxWidth: 600}}>
			{posts.map(post =>
					<PostItem key={post._id} remove={remove} number={post._id} post={post}/>
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

PostList.propTypes = {
	posts: PropTypes.array.isRequired,
	remove: PropTypes.func
}

export default PostList;