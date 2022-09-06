import {useEffect, useState} from 'react';
import cl from './Message.module.css';
import TextareaAutosize from "react-textarea-autosize";
import PropTypes from "prop-types";
import Loader from "../UI/Loader/Loader";

import Picker from "@emoji-mart/react";
import data from "../../assets/emojimart.json";
import {useFile} from "../../hooks/useFile";

const MessageInput = ({sendMessage, message}) => {
	const [text, setText] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [
		files,
		imagePreviewUrls,
		loadingFile,
		handleImageChange,
		deleteImage,
		loadImages] = useFile(false);

	const onSubmit = async (event_) => {
		event_.preventDefault();

		if (!text.trim() && files.length === 0) return
		message.pictures = await loadImages(message.roomId);
		message.text = text;
		sendMessage(message);
		setText('');
	}

	useEffect(() => {
		const array = [...text];
		console.log(array);
		console.log(array.filter(element => /\p{Emoji}/u.test(element)));
	}, [text]);

	return (
		<div>
			<div style={{
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				marginTop: 10
			}}>
				{files.length > 0 &&
					imagePreviewUrls.map((url, index) => (
						<div key={index} className={cl.message__input_img_container}>
							<img
								src={url}
								style={{maxWidth: '100px', maxHeight: '300px', objectFit: 'cover'}}
								alt="Изображение недоступно"
							/>
							<div className={cl.message__input_img_overlay}>
								<button className={cl.icon} onClick={() => deleteImage(index)}>
									<i className="bi bi-x"></i>
								</button>
							</div>
						</div>
					))
				}
				{loadingFile && <Loader/>}
			</div>

			<form onSubmit={onSubmit} className={cl.message__input}>
				<TextareaAutosize
					autoFocus
					value={text}
					placeholder="Сообщение..."
					onChange={event_ => setText(event_.target.value)}
					onKeyPress={(event_) => {
						if (event_.code === "Enter" && !event_.shiftKey) {
							onSubmit(event_);
						}
					}}
					// корректно ставим курсор после добавления эмодзи
					onFocus={(event) => {
						event.currentTarget.selectionEnd = text.length;
						event.currentTarget.selectionStart = text.length;
					}}
				/>
				<button
					className={cl.message__input_pic}
					onClick={() => setShowEmojiPicker(previous => !previous)}
					type="button"
				>
					<i className={`bi bi-emoji-smile${showEmojiPicker ? "-fill" : ""}`}></i>
					{showEmojiPicker &&
						<div
							style={{
								position: 'absolute',
								right: 20,
								bottom: 80,
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
								onEmojiSelect={(element) => setText(text + element.native)}
								theme="light"
								locale="ru"/>
						</div>
					}
				</button>


				<label className={cl.message__input_pic}>
					<input
						type="file"
						name="message_image"
						style={{display: 'none'}}
						multiple={false}
						accept=".jpg, .jpeg, .png, .heic"
						onChange={handleImageChange}
					/>
					<i className="bi bi-image"></i>
				</label>

				<button className={cl.message__input_pic} type="submit">
					<i className="bi bi-arrow-up-circle-fill"></i>
				</button>

			</form>
		</div>
	);
};

MessageInput.propTypes = {
	sendMessage: PropTypes.func.isRequired,
	message: PropTypes.object.isRequired
}

export default MessageInput;