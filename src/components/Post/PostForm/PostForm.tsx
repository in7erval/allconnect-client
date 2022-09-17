import React, {useContext, useRef, useState} from 'react';
import TextareaAutosize from "react-textarea-autosize";
import cl from "./PostForm.module.css";
import PostService from "../../../API/PostService";
// import {useNavigate} from "react-router-dom";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Picker from "@emoji-mart/react";
// import data from "../../../assets/emojimart.json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import data from '@emoji-mart/data';
import Loader from "../../UI/Loader/Loader";
import {useFile} from "../../../hooks/useFile";
import Draggable from "react-draggable";


const PostForm = () => {

	const [postMessage, setPostMessage] = useState("");
	const {store, storePosts} = useContext(Context);
	const userId = store.userId;
	// const navigate = useNavigate();
	const [textareaFocused, setTextareaFocused] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const textAreaReference = useRef<HTMLTextAreaElement>(null);
	const {
		files,
		imagePreviewUrls,
		loadingFile,
		handleImageChange,
		deleteImage,
		loadImages} = useFile(true);

	const addNewPost = async (event_: React.FormEvent) => {
		event_.preventDefault();
		if (postMessage.length === 0 && files.length === 0) return;
		console.log("new post!", postMessage);
		const datas = await loadImages(`post_${userId}`);
		console.log(datas);
		await PostService.addNewPost(userId, postMessage, datas[0])
			// .then(() => navigate(0))
			.catch(error => store.addError(error));
		setPostMessage("");
		storePosts.setReloadPosts(true);

	};

	return (
		<form onSubmit={addNewPost} className={cl.post_form}>
			{loadingFile && <div style={{
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 20
			}}><Loader/></div>}
			{!loadingFile && files.length > 0 &&
				<div style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 20
				}}>
					<div className={cl.input_img_container}>
						<img
							src={imagePreviewUrls[0]}
							style={{maxWidth: '100px', maxHeight: '300px', objectFit: 'cover'}}
							alt="Изображение недоступно"
						/>
						<div className={cl.input_img_overlay}>
							<button className={cl.icon} onClick={() => deleteImage()}>
								<i className="bi bi-x"></i>
							</button>
						</div>
					</div>
				</div>
			}
			<div className={cl.input}>
				<TextareaAutosize
					className={cl.textarea}
					ref={textAreaReference}
					onFocus={() => setTextareaFocused(true)}
					onBlur={() => setTextareaFocused(false)}
					value={postMessage}
					placeholder="Что Вы хотите сказать?"
					onChange={event_ => {
						setPostMessage(event_.target.value);
					}}
					onKeyPress={(event_) => {
						if (event_.code === "Enter" && !event_.shiftKey) {
							addNewPost(event_);
						}
					}}
				/>
				<button
					className={cl.input_pic}
					onClick={() => setShowEmojiPicker(previous => !previous)}
					type="button"
				>
					<i className={`bi bi-emoji-smile${showEmojiPicker ? "-fill" : ""}`}></i>
					{showEmojiPicker &&
						<Draggable>
							<div
								style={{
									position: 'absolute',
									right: 10,
									// bottom: 0,
									top: textAreaReference?.current?.offsetHeight === undefined ? 50 : textAreaReference.current.offsetHeight + 50,
									zIndex: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "right",
									marginRight: 10,
									padding: 10,
									backgroundColor: 'lightgray',
									borderRadius: 10,
									boxShadow: 'black 0 0 50px 10px',
									cursor: 'pointer'
								}}
								onClick={event => event.stopPropagation()}
							>
								<Picker
									data={data}
									onEmojiSelect={(element: { native: string; }) => setPostMessage(previous => previous + element.native)}
									theme="light"
									locale="ru"
								/>
							</div>
						</Draggable>
					}
				</button>


				<label className={cl.input_pic}>
					<input
						type="file"
						name="post_image"
						style={{display: 'none'}}
						multiple={false}
						accept=".jpg, .jpeg, .png, .heic"
						onChange={handleImageChange}
					/>
					<i className="bi bi-image"></i>
				</label>
			</div>
			<button type="submit"
							style={{display: !(textareaFocused || postMessage || files.length > 0) ? "none": ""}}>
				Поделиться
			</button>
		</form>
	);
};

export default observer(PostForm);