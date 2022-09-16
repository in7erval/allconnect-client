import MyModal from "../MyModal/MyModal";
import cl from "./ModalImage.module.css";
import LoadingImage from "../LoadingImage/LoadingImage";
import LoaderForImage from "../Loader/LoaderForImage";
import {Link} from "react-router-dom";
import LoaderForUserPic from "../Loader/LoaderForUserPic";
import Status from "../Status/Status";
import PropTypes from "prop-types";


const ModalImage = ({setShowModal, showModal, imageUrl, userData, type = "post"}) => {
	return (
		<MyModal setVisible={setShowModal} visible={showModal}>
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
		</MyModal>
	);
};

ModalImage.propTypes = {
	setShowModal: PropTypes.func.isRequired,
	showModal: PropTypes.bool.isRequired,
	imageUrl: PropTypes.string.isRequired,
	userData: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
		picture: PropTypes.string.isRequired
	}).isRequired,
	type: PropTypes.string
}

export default ModalImage;