import {useContext, useRef, useState} from 'react';
import TextareaAutosize from "react-textarea-autosize";
import cl from "./PostForm.module.css";
import PostService from "../../../API/PostService";
// import {useNavigate} from "react-router-dom";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import Picker from "@emoji-mart/react";
import data from "../../../assets/emojimart.json";
import Loader from "../../UI/Loader/Loader";
import {useFile} from "../../../hooks/useFile";

const PostForm = () => {

	const [postMessage, setPostMessage] = useState("");
	const {store} = useContext(Context);
	const userId = store.userId;
	// const navigate = useNavigate();
	const [textareaFocused, setTextareaFocused] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const textAreaReference = useRef();
	const [
		files,
		imagePreviewUrls,
		loadingFile,
		handleImageChange,
		deleteImage,
		loadImages] = useFile(true);

	const addNewPost = async (event_) => {
		event_.preventDefault();
		if (!postMessage || files.length === 0) return;
		console.log("new post!", postMessage);
		const datas = await loadImages(`post_${userId}`);
		console.log(datas);
		await PostService.addNewPost(userId, postMessage, datas[0])
			// .then(() => navigate(0))
			.catch(error => store.addError(error));
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
						<div
							style={{
								position: 'absolute',
								right: 10,
								// bottom: 0,
								top: textAreaReference.current.offsetHeight + 50,
								zIndex: 2,
								display: "flex",
								alignItems: "center",
								justifyContent: "right",
								marginRight: 10
							}}
							onClick={event => event.stopPropagation()}
						>
							<Picker
								data={data}
								onEmojiSelect={(element) => setPostMessage(previous => previous + element.native)}
								theme="light"
								locale="ru"/>
						</div>
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
			{((textareaFocused && postMessage) || files.length > 0) &&
				<button type="submit">Поделиться</button>
			}
		</form>
	);
};

export default observer(PostForm);