import {useContext, useState} from 'react';
import cl from "./UserPageInfo.module.css";
import LoadingImage from "../../../../components/UI/LoadingImage/LoadingImage";
import userpic from "../../../../assets/userpic.jpeg";
import LoaderForImage from "../../../../components/UI/Loader/LoaderForImage";
import {Link, useParams} from "react-router-dom";
import Status from "../../../../components/UI/Status/Status";
import TextareaAutosize from "react-textarea-autosize";
import UserService from "../../../../API/UserService";
import {Context} from "../../../../index";
import MyModal from "../../../../components/UI/MyModal/MyModal";
import ImageUploader from "../../../../components/UI/ImageUploader/ImageUploader";
import PropTypes from "prop-types";
import UserPageEditor from "./UserPageEditor";


const createRoomId = (firstId, secondId) => firstId > secondId ? `${firstId}:${secondId}` : `${secondId}:${firstId}`;

const UserPageInfo = ({userData, postsCount, mutualFriendsCount, isFriend: _isFriend}) => {

	const {store, storeModalImage} = useContext(Context);
	const [showImageUploader, setShowImageUploader] = useState(false);
	const [textStatus, setTextStatus] = useState(userData.textStatus ?? (isOwner ? `На чиле... Или напиши свой "статус"` : ""));
	const [editTextStatus, setEditTextStatus] = useState(false);
	const [isFriend, setIsFriend] = useState(_isFriend);
	const [showPageEditor, setShowPageEditor] = useState(false);
	const pageUserId = useParams().id;
	const loggedUserId = store.userId;
	const isOwner = pageUserId === loggedUserId;


	const addFriend = async () => {
		await UserService.addFriend(loggedUserId, pageUserId)
			.then(() => console.debug("successfully added friend"))
			.catch(error => store.addError(error));
		setIsFriend(true);
	};

	const deleteFriend = async () => {
		await UserService.deleteFriend(loggedUserId, pageUserId)
			.then(() => console.debug("successfully deleted friend"))
			.catch(error => store.addError(error));
		setIsFriend(false);
	}

	return (
		<div className={cl.user_page__pic_name}>
			<div className={cl.user_page__pic_and_btns}>
				<div className={cl.user_pic}>
					<LoadingImage
						src={userData.picture ?? userpic}
						alt={"Изображение недоступно"}
						onClick={() => storeModalImage.initModal(
							userData.picture,
							{
								firstName: userData.firstName,
								lastName: userData.lastName,
								id: userData._id,
								picture: userData.picture
							}
						)}
						showWhenLoading={<LoaderForImage/>}
					/>
				</div>
				<div className={cl.user_pic_btns}>
					{isOwner &&
						<>
							<button onClick={() => setShowImageUploader(true)} className={cl.user_button}>
								Загрузить фото
							</button>
							<button onClick={() => setShowPageEditor(true)} className={cl.btn_without_background}>
								Редактировать страницу
							</button>
						</>
					}
					{!isOwner &&
						<div>
							<Link to={`/messages/${createRoomId(pageUserId, loggedUserId)}`}>
								Написать сообщение
							</Link>
						</div>}
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
			<div className={cl.user_page__info_stats}>
				<div className={cl.user_page__info}>
					<div style={{display: "flex", flexDirection: "column"}}>
						<div style={{marginRight: -15, marginTop: -15, height: 20, alignSelf: "flex-end"}}>
							<Status userId={pageUserId}/>
						</div>
						<h2>{userData.lastName} {userData.firstName}</h2>
						{(textStatus || isOwner) &&
							<div style={{
								display: "flex",
								alignItems: "flex-end",
								marginBottom: 10
							}}>
								{!editTextStatus ?
									<p
										className={cl.user_page__info_status}
										onClick={() => isOwner ? setEditTextStatus(true) : console.log('click')}>
										{textStatus && textStatus.length > 0 ? textStatus : "На чиле... Или напиши свой \"статус\""}
									</p>
									:
									<TextareaAutosize
										autoFocus={true}
										value={textStatus}
										placeholder={`На чиле... Или напиши свой "статус"`}
										onChange={event_ => {
											UserService.update({...userData, textStatus: event_.target.value})
												.catch(error => store.addError(error));
											setTextStatus(event_.target.value);
										}}
										onBlur={() => setEditTextStatus(false)}
										onFocus={(event) => event.target.selectionStart = event.target.selectionEnd = textStatus.length}
									/>
								}
								<div style={{height: 15, width: 15, backgroundColor: "#f1f1f1", borderRadius: "50%"}}></div>
								<div style={{height: 10, width: 10, backgroundColor: "#f1f1f1", borderRadius: "50%"}}></div>
								<div style={{height: 5, width: 5, backgroundColor: "#f1f1f1", borderRadius: "50%"}}></div>
							</div>
						}
						{/* fixme: Убрал редактирование имени, сделать отдельную страницу*/}
						{/*{isOwner ? (*/}
						{/*		<form onSubmit={changeName}>*/}
						{/*			<FlexibleInput*/}
						{/*				content={editedLastName}*/}
						{/*				onChange={event_ => setEditedLastName(event_.target.value)}*/}
						{/*			/>*/}
						{/*			<FlexibleInput*/}
						{/*				content={editedFirstName}*/}
						{/*				onChange={event_ => setEditedFirstName(event_.target.value)}*/}
						{/*			/>*/}
						{/*			<button type="submit" hidden/>*/}
						{/*		</form>*/}
						{/*	) :*/}
						{/*	(<h2>{userResponse.data.lastName} {userResponse.data.firstName}</h2>)*/}
						{/*}*/}

					</div>
					<div style={{backgroundColor: "lightgray", width: "100%", height: 1}}></div>
					<p style={{fontSize: "0.9rem", color: "gray"}}>Информация отсутствует</p>
				</div>
				<div className={cl.user_page__stats}>
					<Link to={`/friends/${isOwner ? "" : pageUserId}`}>
						<div>{userData.friends?.length}</div>
						<p>друзей</p>
					</Link>
					<Link to="#" aria-disabled={true} className={cl.disabled_link}>
						<div>{postsCount}</div>
						<p>записей</p>
					</Link>
					{!isOwner &&
						<Link to="#" aria-disabled={true} className={cl.disabled_link}>
							<div>{mutualFriendsCount}</div>
							<p>общих друзей</p>
						</Link>
					}
				</div>
			</div>

			{isOwner &&
				// todo: сделать одну модалку с разным контентом!
				<>
					<MyModal
						visible={showImageUploader}
						setVisible={setShowImageUploader}
					>
						<ImageUploader
							setModalVisible={setShowImageUploader}
							currentImg={userData.picture ?? userpic}
						/>
					</MyModal>
					<MyModal
						visible={showPageEditor}
						setVisible={setShowPageEditor}
					>
						<UserPageEditor/>
					</MyModal>
				</>
			}
		</div>
	);
};

UserPageInfo.propTypes = {
	userData: PropTypes.shape({
		picture: PropTypes.string,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		_id: PropTypes.string.isRequired,
		friends: PropTypes.array.isRequired,
		textStatus: PropTypes.string
	}),
	postsCount: PropTypes.number.isRequired,
	mutualFriendsCount: PropTypes.number.isRequired,
	isFriend: PropTypes.bool.isRequired,

}

export default UserPageInfo;