import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetching} from "../../hooks/useFetching";
import Loader from "../../components/UI/Loader/Loader";
import UserService from "../../API/UserService";
import AsideNav from "../../components/AsideNav/AsideNav";
import PostList from "../../components/Post/PostList";
import {getPageCount} from "../../utils/pages";
import {useObserver} from "../../hooks/useObserver";
import userpic from "../../assets/userpic.jpeg";
import FlexibleInput from "../../components/UI/FlexibleInput/FlexibleInput.jsx";
import cl from "./UserPage.module.css";
import MyModal from "../../components/UI/MyModal/MyModal";
import ImageUploader from "../../components/UI/ImageUploader/ImageUploader";
import PostForm from "../../components/Post/PostForm/PostForm.jsx";

const determineIsFriend = (userFriendsId, friendId) => {
	console.log(`determineIsFriend(${userFriendsId}, ${friendId})`);
	if (userFriendsId.length === 0) {
		return false;
	}
	for (let userFriendId of userFriendsId) {
		if (userFriendId === friendId) {
			return true;
		}
	}
	return false;
}

const UserPage = () => {

		const LIMIT_POSTS = 10;
		const params = useParams();
		const pageUserId = params.id;
		console.log("pageUserId: ", pageUserId, params);
		const loggedUserId = localStorage.getItem("userId");
		const isOwner = pageUserId === loggedUserId;

		const [user, setUser] = useState({});
		const [showAllFriends, setShowAllFriends] = useState(false);
		const [pagePost, setPagePost] = useState(1);
		const [posts, setPosts] = useState([]);
		const [totalPosts, setTotalPosts] = useState(0);
		const [totalPages, setTotalPages] = useState(0);
		const [isFriend, setIsFriend] = useState(false);
		const lastElement = useRef();

		const [showImageUploader, setShowImageUploader] = useState(false);


		const [editedFirstName, setEditedFirstName] = useState("");
		const [editedLastName, setEditedLastName] = useState("");

		const addFriend = () => {
			UserService.addFriend(loggedUserId, pageUserId)
				.then(() => console.debug("successfully added friend"));
			setIsFriend(true);
		};

		const deleteFriend = () => {
			UserService.deleteFriend(loggedUserId, pageUserId)
				.then(() => console.debug("successfully deleted friend"));
			setIsFriend(false);
		}

		const [fetchUserForPage, isLoading, error] = useFetching(async () => {
			let resp = await UserService.getFullById(pageUserId);
			let user = resp.body;

			setUser(user);

			if (!isOwner) {
				let resp = await UserService.getById(loggedUserId);
				let loggedUser = resp.body;
				console.debug("logged user: ", loggedUser);
				setEditedFirstName(loggedUser.firstName);
				setEditedLastName(loggedUser.lastName);
				const _isFriend = determineIsFriend(loggedUser.friends, pageUserId);
				console.debug("isFriend", _isFriend);
				setIsFriend(_isFriend);
			} else {
				console.debug("Owner page, welcome!");
				console.debug(`editedFirstName=${user.firstName}, editedLastName=${user.lastName}`);
				setEditedFirstName(user.firstName);
				setEditedLastName(user.lastName);
			}
		});

		const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
			let response = await UserService.getUserPosts(pageUserId, LIMIT_POSTS, pagePost);
			setPosts([...posts, ...response.body]);
			const totalCount = response.count;
			console.log("totalCount: ", totalCount);
			setTotalPosts(totalCount);
			setTotalPages(getPageCount(totalCount, LIMIT_POSTS));
		});

		useObserver(lastElement, pagePost < totalPages, isPostsLoading,
			() => {
				setPagePost(pagePost + 1);

				console.debug('useObserver');
				console.debug('pagePost', pagePost + 1);
			});

		useEffect(() => {
			console.log("fetch user for page");
			fetchUserForPage();
		}, []);


		useEffect(() => {
			console.log("fetch posts");
			fetchPosts();
		}, [pagePost]);


		const changeName = (e) => {
			e.preventDefault();
			UserService.changeName(loggedUserId, editedFirstName, editedLastName)
				.then(() => console.debug("name changed successfully"));
		}

		/* todo: fix loader */
		return (
			<div className="default_page">
				<AsideNav/>
				<div className="default_page__content justify-content-start"
						 style={{marginLeft: 25}}>
					<div className={cl.user_page}>
						{isLoading ?
							<Loader/> : (
								<div className={cl.user_page__pic_name}>
									<div className={cl.user_page__pic_and_btns}>
										<div className={cl.user_pic}>
											<img src={user.picture === null || user.picture === undefined
												? userpic : user.picture} alt={"pic"}/>
										</div>
										<div className={cl.user_pic_btns}>
											{isOwner &&
												<button onClick={() => setShowImageUploader(true)}>
													Загрузить фото
												</button>
											}
											{!isOwner && (!isFriend ?
												(<button onClick={addFriend}>
													Добавить в друзья
												</button>) :
												(<button className={cl.danger} onClick={deleteFriend}>
													Удалить из друзей
												</button>))
											}
										</div>
									</div>
									<div className={cl.user_page__info}>
										{isOwner ? (
												<form onSubmit={changeName}>
													<FlexibleInput
														content={editedLastName}
														onChange={e => setEditedLastName(e.target.value)}
													/>
													<FlexibleInput
														content={editedFirstName}
														onChange={e => setEditedFirstName(e.target.value)}
													/>
													<button type="submit" hidden/>
												</form>
											) :
											(<h1>{user.lastName} {user.firstName}</h1>)
										}
										<hr/>
									</div>
								</div>
							)}

						<div style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center'
						}}>
							{isLoading ?
								<Loader/> : (
									<div className={cl.user_page__friends}>
										<div className={cl.user_page__friends_header}>
											<div>Друзья</div>
											<div>
												<p>{user?.friends?.length}</p>
											</div>
										</div>
										<div className={cl.user_page__friends_imgs}
												 onClick={() => setShowAllFriends(!showAllFriends)}>
											{
												(showAllFriends ? user?.friends : user?.friends?.slice(0, 6))
													?.map(el =>
														(<a key={el._id} href={"/user" + el._id} className="tooltip">
																<span className="tooltiptext">{el.lastName} {el.firstName}</span>
																<img src={el.picture ? el.picture : userpic} alt="pic"/>
															</a>
														)
													)
											}
										</div>
									</div>
								)}
							<div style={{flex: 1}}>
								<div className={cl.user_page__posts_header}>
									<div>Посты</div>
									<div>
										<p>{totalPosts}</p>
									</div>
								</div>
								<div>
									{isOwner && <PostForm />}
									{isPostsLoading && <Loader/>}
									<PostList
										remove={null}
										posts={posts}
									/>
									<div ref={lastElement} style={{height: 20}}/>
								</div>
							</div>
						</div>


					</div>

				</div>

				{isOwner && !isLoading &&
					<MyModal
						visible={showImageUploader}
						setVisible={setShowImageUploader}
						children={<ImageUploader
							currentImg={user.picture === null || user.picture === undefined
								? userpic : user.picture}
						/>}
					/>
				}

			</div>
		);
	}
;

export default UserPage;