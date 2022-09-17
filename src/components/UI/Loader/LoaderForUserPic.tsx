import cl from "./Loader.module.css";
import PropTypes from "prop-types";

const LoaderForUserPic = ({small = false}) => {
	const classname = small ? cl.loader_user_pic_small : cl.loader_user_pic;
	return (
		<div className={classname}>

		</div>
	);
};

LoaderForUserPic.propTypes = {
	small: PropTypes.bool
}

export default LoaderForUserPic;