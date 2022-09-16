import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import UserService from "../../API/UserService";
import PostList from "../../components/Post/PostList";
import userpic from "../../assets/userpic.jpeg";
import cl from "./UserPage.module.css";
import PostForm from "../../components/Post/PostForm/PostForm.jsx";
import Status from "../../components/UI/Status/Status";
import {useInView} from "react-intersection-observer";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import LoadingImage from "../../components/UI/LoadingImage/LoadingImage";
import LoaderForUserPic from "../../components/UI/Loader/LoaderForUserPic";
import LoaderPostList from "../../components/UI/Loader/LoaderPostList";
import LoaderText from "../../components/UI/Loader/LoaderText";
import UserPageInfo from "./blocks/UserPageInfo/UserPageInfo";
import LoaderUserInfo from "./blocks/UserPageInfo/LoaderUserInfo";

const determineIsFriend = (userFriendsId, friendId) => {
	return userFriendsId.map(element => element._id).includes(friendId);
}

// todo: super не оптимизировано!!! O(n^2)!!!!
const determineMutualFriends = (friends1, friends2) => {
	const mutualFriends = [];
	for (let friend1 of friends1) {
		for (let friend2 of friends2) {
			if (friend1._id === friend2._id) {
				mutualFriends.push(friend1);
			}
		}
	}
	return mutualFriends;
}

const LoaderFriends = () => {
	return (
		<div className={cl.user_page__friends}>
			<Link to="#">
				<div className={cl.user_page__friends_header}>
					<div>Друзья</div>
					<div>
						<LoaderText/>
					</div>
				</div>
			</Link>
			<div className={cl.user_page__friends_imgs}>
				<Link to="#" className="tooltip">
					<span className="tooltiptext"><LoaderText/></span>
					<LoaderForUserPic/>
				</Link>
				<Link to="#" className="tooltip">
					<span className="tooltiptext"><LoaderText/></span>
					<LoaderForUserPic/>
				</Link>
				<Link to="#" className="tooltip">
					<span className="tooltiptext"><LoaderText/></span>
					<LoaderForUserPic/>
				</Link>
			</div>
		</div>
	);
}

const UserPage = () => {
		const LIMIT_POSTS = 10;
		const pageUserId = useParams().id;
		const {store, storePosts} = useContext(Context);
		const loggedUserId = store.userId;
		const isOwner = pageUserId === loggedUserId;
		const [showAllFriends, setShowAllFriends] = useState(false);
		const [showAllMutualFriends, setShowAllMutualFriends] = useState(false);
		const [isFriend, setIsFriend] = useState(false);
		const {ref: lastElement, inView} = useInView();

		const [mutualFriends, setMutualFriends] = useState([]);


		const fetchUser = async () => {
			return UserService.getFullById(pageUserId);
		}

		const fetchLoggedUser = async () => {
			return UserService.getFullById(loggedUserId);
		}

		useEffect(() => {
			console.log("reloadPosts", storePosts.reloadPosts)
			if (storePosts.reloadPosts) {
				refetch();
				storePosts.setReloadPosts(false);
			}
		}, [storePosts.reloadPosts]);

		const {
			isLoading: isLoadingLoggedUser,
			data: loggedUserResponse,
			refetch: refetchLoggedUser
		} = useQuery(["loggedUser"], fetchLoggedUser);

		const {
			isLoading: isLoadingUser,
			isFetching,
			data: userResponse,
			refetch: refetchUser
		} = useQuery([`user${pageUserId}`], fetchUser);

		useEffect(() => {
			if (!isFetching && !isOwner && !isLoadingLoggedUser) {
				setIsFriend(determineIsFriend(userResponse.data.friends, loggedUserId));
				setMutualFriends(determineMutualFriends(loggedUserResponse.data.friends, userResponse.data.friends));
			}
			if (!isFetching) {
				document.title = `${userResponse.data.firstName} ${userResponse.data.lastName}`;
			}
			// else {
			// 	setEditedFirstName(userResponse.data.firstName);
			// 	setEditedLastName(userResponse.data.lastName);
			// }
			// }
		}, [isFetching]);

		const fetchPosts = ({pageParam: pageParameter = 1}) => {
			return UserService.getUserPosts(pageUserId, LIMIT_POSTS, pageParameter);
		}

		const {
			isLoading: isLoadingPosts,
			data: postsData,
			fetchNextPage,
			hasNextPage,
			refetch
		} = useInfiniteQuery([`userPosts${pageUserId}`], fetchPosts, {
			getNextPageParam: (lastPage, _pages) => {
				let lastPageNumber = lastPage.config.params.page;
				return LIMIT_POSTS * lastPageNumber < lastPage.data.count ? lastPageNumber + 1 : undefined;
			},
		});

		useEffect(() => {
			console.log("fetch posts with another id");
			refetch();
			refetchUser();
			refetchLoggedUser();
		}, [pageUserId]);

		useEffect(() => {
			if (inView && hasNextPage) {
				fetchNextPage();
			}
		}, [inView]);


		// const changeName = async (event_) => {
		// 	event_.preventDefault();
		// 	await UserService.changeName(loggedUserId, editedFirstName, editedLastName)
		// 		.then(() => console.debug("name changed successfully"))
		// 		.catch(error => store.addError(error));
		// };

		const indexForFriendsArray = showAllFriends ? undefined : 6;
		const indexForMutualFriendsArray = showAllMutualFriends ? undefined : 6;

		return (
			<div className={cl.user_page + " justify-content-start"}>
				{isLoadingUser || isLoadingPosts || isLoadingLoggedUser ? <LoaderUserInfo/> :
					<UserPageInfo
						userData={userResponse.data}
						mutualFriendsCount={mutualFriends.length}
						postsCount={postsData.pages[0].data.count}
						isFriend={isFriend}
					/>
				}

				<div style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center'
				}}>
					{isLoadingUser ? <LoaderFriends/> : (
						<div style={{
							display: 'flex',
							// justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column'
						}}>
							<div className={cl.user_page__friends}>
								<Link to={`/friends/${isOwner ? "" : pageUserId}`}>
									<div className={cl.user_page__friends_header}>
										<div>Друзья</div>
										<div>
											<p>{userResponse.data?.friends?.length}</p>
										</div>
									</div>
								</Link>
								<div className={cl.user_page__friends_imgs}>
									{userResponse.data?.friends?.slice(0, indexForFriendsArray)?.map(element =>
										(<Link key={element._id} to={"/user" + element._id} className="tooltip">
												<span className="tooltiptext">{element.lastName} {element.firstName}</span>
												<LoadingImage
													src={element.picture ?? userpic}
													alt="Изображение недоступно"
													showWhenLoading={<LoaderForUserPic/>}
												/>
												<div style={{position: "relative", top: -20, right: 10}}>
													<Status userId={element._id} disableHover={true}/>
												</div>
											</Link>
										)
									)
									}
								</div>
								{userResponse.data?.friends?.length > 6 &&
									<button className={cl.user_page__friends_imgs__helper_btn}
													onClick={() => setShowAllFriends(!showAllFriends)}>
										{showAllFriends ? "Скрыть" : "Показать всех"}
									</button>
								}
							</div>
							{!isOwner &&
								<div className={cl.user_page__friends}>
									<div>
										<div className={cl.user_page__friends_header}>
											<div>Общие друзья</div>
											<div>
												<p>{mutualFriends.length}</p>
											</div>
										</div>
									</div>
									<div className={cl.user_page__friends_imgs}>
										{mutualFriends.slice(0, indexForMutualFriendsArray)?.map(element =>
											(<Link key={element._id} to={"/user" + element._id} className="tooltip">
													<span className="tooltiptext">{element.lastName} {element.firstName}</span>
													<LoadingImage
														src={element.picture ?? userpic}
														alt="Изображение недоступно"
														showWhenLoading={<LoaderForUserPic/>}
													/>
													<div style={{position: "relative", top: -20, right: 10}}>
														<Status userId={element._id} disableHover={true}/>
													</div>
												</Link>
											)
										)
										}
									</div>
									{mutualFriends.length > 6 &&
										<button className={cl.user_page__friends_imgs__helper_btn}
														onClick={() => setShowAllMutualFriends(!showAllMutualFriends)}>
											{showAllMutualFriends ? "Скрыть" : "Показать всех"}
										</button>
									}
								</div>
							}
						</div>
					)}


					<div style={{flex: 5}}>
						{isOwner &&
							<div className={cl.user_page__posts_form}>
								<PostForm/>
							</div>
						}
						<div className={cl.user_page__posts_header}>
							<p>Посты</p>
							<p>{isLoadingPosts ? "загрузка..." : postsData.pages[0].data.count}</p>
						</div>
						{isLoadingPosts ? <LoaderPostList/> : postsData.pages.map((group, index) => (
							<React.Fragment key={index}>
								<PostList
									remove={() => console.log("remove")}
									posts={group.data.body}
								/>
							</React.Fragment>
						))}
						<div ref={lastElement} style={{height: 20}}/>
					</div>

				</div>

			</div>
		);
	}
;

export default observer(UserPage);