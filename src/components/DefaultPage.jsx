import AsideNav from "./AsideNav/AsideNav";
import PropTypes from "prop-types";
import {observer} from "mobx-react-lite";
import BackgroundWork from "./BackgroundWork";
import {useContext} from "react";
import {Context} from "../index";

const DefaultPage = ({children}) => {

	const {store} = useContext(Context);

	return (
		<div className="default_page">
			{store.isAuth && <AsideNav/>}
			<div className="default_page__content">
				{children}
			</div>
			{store.isAuth && <BackgroundWork/>}
		</div>
	);
};

DefaultPage.propTypes = {
	children: PropTypes.element
}

export default observer(DefaultPage);