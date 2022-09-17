import React, {FC, useContext, useEffect, useState} from 'react';
import cl from './ImageUploader.module.css';
import UserService from "../../../API/UserService";
import {useNavigate} from "react-router-dom";
import Loader from "../Loader/Loader";
import {Context} from "../../../index";
import {useFile} from "../../../hooks/useFile";

interface ImageUploaderProperties {
    currentImg: string;
    setModalVisible: (_value: boolean) => void;
}

const ImageUploader: FC<ImageUploaderProperties> = ({currentImg, setModalVisible}) => {
        const {
            files,
            imagePreviewUrls,
            loadingFile,
            handleImageChange,
            deleteImage: _delete,
            loadImages: _load
        } = useFile(true);
        const [imagePreviewUrl, setImagePreviewUrl] = useState(currentImg);
        const [loading, setLoading] = useState(false);
        const {store} = useContext(Context);
        const userId = store.userId;
        const navigate = useNavigate();

        useEffect(() => {
            if (imagePreviewUrls.length === 1) {
                setImagePreviewUrl(imagePreviewUrls[0]);
            }
        }, [imagePreviewUrls]);

        const _handleSubmit = async (event_: React.FormEvent) => {
            event_.preventDefault();
            console.log(event_);
            console.log('handle uploading-', files[0]);
            setLoading(true);
            await UserService.savePhoto(userId, files[0]);
            navigate(0);
            setLoading(false);
        }

        return (
            <div className={cl.image_uploader}>
                <div className={cl.header}>
                    <p>
                        Загрузка фотографии
                    </p>
                    <button type="button" onClick={() => setModalVisible(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className={cl.description}>
                    Вы можете загрузить изображение в формате JPG, PNG или HEIC.
                </div>
                <div className={cl.preview}>
                    {loading || loadingFile ? <Loader/> : <img src={imagePreviewUrl} alt="pic"/>}
                </div>
                <form onSubmit={_handleSubmit}>
                    <label className={cl.file_input}>
                        <input
                            className={cl.file_input}
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                        />
                        Выбрать фото
                    </label>
                    {<button className={cl.submit} type="submit">
                        Загрузить
                    </button>
                    }
                </form>
            </div>
        );
    }
;

export default ImageUploader;