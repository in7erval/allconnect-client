import {useState} from 'react';
import PropTypes from "prop-types";

const LoadingImage = ({showWhenLoading, ...properties}) => {
	const [isLoading, setIsLoading] = useState(true);
	return <>
		<img
			{...properties}
			style={{display: `${isLoading ? "none" : "unset"}`}}
			onLoad={() => setIsLoading(false)}
		/>
		{isLoading && showWhenLoading}
	</>
};

LoadingImage.propTypes = {
	showWhenLoading: PropTypes.element.isRequired
}

export default LoadingImage;