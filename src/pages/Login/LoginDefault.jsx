import cl from './Login.module.css';
import logo from "../../assets/logo.png";
import PropTypes from "prop-types";
import {useRef} from "react";

const LoginDefault = ({setIsLoginOpen, setIsRegistrationOpen}) => {

	const reference = useRef();

	// const [xTransform, setXTransform] = useState(0);
	// const [yTransform, setYTransform] = useState(0);
	//
	// useEffect(() => {
	// 	const rect = reference.current.getBoundingClientRect();
	// 	const centerX = rect.x + rect.width / 2;
	// 	const centerY = rect.y + rect.height / 2;
	// 	const preTransformX = (centerX - cursorX) / 1000;
	// 	const preTransformY = (centerY - cursorY) / 1000;
	// 	const BOUND = 0.2
	// 	setXTransform(preTransformX > 0 ? Math.min(preTransformX, BOUND) : Math.max(preTransformX, -BOUND));
	// 	setYTransform(preTransformY > 0 ? Math.min(preTransformY, BOUND) : Math.max(preTransformY, -BOUND));
	// 	reference.current.style.boxShadow = `gray ${xTransform} ${yTransform} 10px`; //fixme: not works
	// 	// console.log(reference.current.style.boxShadow);
	// });

	return (
		<div
			ref={reference}
			className={cl.login_page__login + " w-400"}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
				<img src={logo} className={cl.logo} alt="logo"/>
				<div className={cl.login_page__login_title}>
					Вход allconnect
				</div>
			</div>
			<div className={cl.login_page__login_button_group}>
				<button
					className={cl.login_page__login_button + " mb-20"}
					onClick={() => setIsLoginOpen(true)}>
					Войти
				</button>
				<button className={cl.login_page__login_button + " " + cl.btn_register_color}
								onClick={() => setIsRegistrationOpen(true)}>
					Зарегистрироваться
				</button>
			</div>
		</div>
	);
};

LoginDefault.propTypes = {
	setIsLoginOpen: PropTypes.func.isRequired,
	setIsRegistrationOpen: PropTypes.func.isRequired,
	cursorX: PropTypes.number.isRequired,
	cursorY: PropTypes.number.isRequired
}

export default LoginDefault;