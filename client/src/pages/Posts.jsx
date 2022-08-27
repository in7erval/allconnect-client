import {useEffect, useRef, useState} from 'react';
import {useFetching} from "../hooks/useFetching";
import PostService from "../API/PostService";
import {getPageCount} from "../utils/pages";
import Loader from "../components/UI/Loader/Loader";
import PostList from "../components/Post/PostList";
import {useObserver} from "../hooks/useObserver";
import {USER_ID} from "../constants";

function Posts() {
	const [posts, setPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const LIMIT_POSTS = 10;
	const [page, setPage] = useState(1);
	const lastElement = useRef();
	const userId = localStorage.getItem(USER_ID);

	console.log(userId);

	const [fetchPosts, isPostsLoading, _postError] = useFetching(async (isNew) => {
		let response = await PostService.getAllForUser(userId, LIMIT_POSTS, page);
		if (isNew) {
			setPosts([...response.body]);
		} else {
			setPosts([...posts, ...response.body])
		}
		const totalCount = response.count;
		console.log("totalCount:", totalCount);
		setTotalPages(getPageCount(totalCount, LIMIT_POSTS));
	});

	useEffect(() => {
		fetchPosts();
	}, [page]);

	useEffect(() => {
		fetchPosts(true);
	}, [userId]);

	useObserver(lastElement, page < totalPages, isPostsLoading,
		() => {
			setPage(page + 1);
			console.log('useObser');
		});

	return (
		<div>
			<PostList
				remove={Object.create(null)}
				posts={posts}
			/>
			{isPostsLoading &&
				<div style={{
					display: "flex",
					justifyContent: 'center',
					marginTop: 50
				}}>
					<Loader/>
				</div>
			}
			<div ref={lastElement} style={{height: 20}}/>
		</div>
	);
}

export default Posts;