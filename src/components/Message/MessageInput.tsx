import React, {FC, useState} from 'react';
import TextareaAutosize from "react-textarea-autosize";
import Loader from "../UI/Loader/Loader";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Picker from "@emoji-mart/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import data from '@emoji-mart/data';
import {IUseFile, useFile} from "../../hooks/useFile";
import Draggable from "react-draggable";

import cl from './Message.module.css';
import IMessageToSend from "../../models/IMessageToSend";

interface MessageInputProperties {
    sendMessage: (_message: IMessageToSend) => void,
    message: IMessageToSend
}

const MessageInput: FC<MessageInputProperties>
    = ({
           sendMessage,
           message
       }) => {
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const {
        files,
        imagePreviewUrls,
        loadingFile,
        handleImageChange,
        deleteImage,
        loadImages
    }: IUseFile = useFile(false);

    const onSubmit = async (event_: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        event_.preventDefault();

        if (!text.trim() && files.length === 0) return
        message.pictures = await loadImages(message.roomId);
        message.text = text;
        sendMessage(message);
        setText('');
    }

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
											<Draggable>
												<div
													style={{
                              position: 'absolute',
                              right: 20,
                              bottom: 80,
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
														onEmojiSelect={(element: { native: string; }) => setText(text + element.native)}
														theme="light"
														locale="ru"
													/>
												</div>
											</Draggable>
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

export default MessageInput;