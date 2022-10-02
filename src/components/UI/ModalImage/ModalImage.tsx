import DefaultModal from "../DefaultModal/DefaultModal";
import cl from "./ModalImage.module.css";
import LoadingImage from "../LoadingImage/LoadingImage";
import LoaderForImage from "../Loader/LoaderForImage";
import {Link} from "react-router-dom";
import LoaderForUserPic from "../Loader/LoaderForUserPic";
import Status from "../Status/Status";
import {FC} from "react";
import IUserDataForModalImage from "../../../models/IUserDataForModalImage";

interface ModalImageProperties {
    setShowModal: (_value: boolean) => void;
    showModal: boolean;
    imageUrl: string;
    userData: IUserDataForModalImage | null;
    type?: string
}

const ModalImage: FC<ModalImageProperties>
    = ({
           setShowModal,
           showModal,
           imageUrl,
           userData,
           type = "post"
       }) => {
    if (userData === null) {
        return null;
    }
    return (
        <DefaultModal setVisible={setShowModal} visible={showModal}>
            <div className={cl.modal_image}>
                <div className={cl.modal_image_and_desc}>
                    <LoadingImage
                        src={imageUrl}
                        alt={"Изображение недоступно"}
                        showWhenLoading={<LoaderForImage/>}
                    />
                    <div className={cl.modal_desc}>
                        Фотография {type === "post" && "со страницы"} {userData.firstName}
                    </div>
                </div>
                <div className={cl.modal_info}>
                    <Link to={`/user${userData.id}`} className={cl.modal_profile}>
                        <div>
                            <LoadingImage
                                src={userData.picture}
                                alt="Изображение недоступно"
                                showWhenLoading={
                                    <div style={{marginRight: 10}}>
                                        <LoaderForUserPic/>
                                    </div>
                                }/>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-around",
                                    alignItems: "flex-start",
                                    height: "50px",
                                    color: 'black'
                                }}>
                                <p>
                                    {`${userData.firstName} ${userData.lastName}`}
                                </p>
                                <Status userId={userData.id}/>
                            </div>
                        </div>
                    </Link>
                    <div className={cl.modal_add_info}>
                        Ещё какая-нибудь чушь будет тут, наверное...
                    </div>
                </div>
            </div>
        </DefaultModal>
    );
};

export default ModalImage;