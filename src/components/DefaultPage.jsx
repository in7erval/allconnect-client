import AsideNav from "./AsideNav/AsideNav";
import PropTypes from "prop-types";
import {observer} from "mobx-react-lite";
import BackgroundWork from "./BackgroundWork";
import {useContext} from "react";
import {Context} from "../index";
import ModalImage from "./UI/ModalImage/ModalImage";

const DefaultPage = ({children}) => {

	const {store, storeModalImage} = useContext(Context);

	return (
		<div className="default_page">
			{store.isAuth && <AsideNav/>}
			<div className="default_page__content">
				{children}
			</div>
			{store.isAuth && <BackgroundWork/>}
			<ModalImage
				setShowModal={(value) => storeModalImage.setShowModal(value)}
				userData={storeModalImage.userData}
				imageUrl={storeModalImage.imageUrl}
				showModal={storeModalImage.showModal}
				type={storeModalImage.type}
			/>
		</div>
	);
};

DefaultPage.propTypes = {
	children: PropTypes.element
}

export default observer(DefaultPage);