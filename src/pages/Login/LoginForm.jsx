import cl from './Login.module.css';
import PropTypes from "prop-types";
import {useContext, useRef, useState} from "react";
import {Context} from "../../index";

const LoginForm = ({setIsRegistrationOpen}) => {

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

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const {store} = useContext(Context);

	const sendData = async (event_) => {
		event_.preventDefault();
		await store.login(email, password);
	}

	let titleForButton = "Войти";
	if (!email || !password) {
		titleForButton = "Введите";
		if (!email) {
			titleForButton += " email";
		}
		if (!email && !password) {
			titleForButton += " и";
		}
		if (!password) {
			titleForButton += " пароль";
		}
	}

	return (
		<div
			ref={reference}
			className={cl.login_page__login}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
				{/*<img src={logo} className={cl.logo} alt="logo"/>*/}
				<div className={cl.login_page__login_title}>
					<span>allconnect</span>
				</div>
			</div>
			<form className={cl.login_form} onSubmit={sendData}>
				<div className={cl.login_form__input_group}>
					<input
						id="email"
						type="email"
						autoFocus={true}
						required={true}
						autoComplete="email"
						placeholder="Электронная почта"
						value={email}
						onChange={event_ => setEmail(event_.target.value)}
					/>
				</div>
				<div className={cl.login_form__input_group} style={{flexDirection: "row", justifyContent: "space-between"}}>
					<input
						id="current-password"
						placeholder="Пароль"
						required={true}
						type={passwordVisible ? "text" : "password"}
						onChange={event_ => setPassword(event_.target.value)}
						value={password}
						style={{flex: 1}}
					/>
					<div
						onClick={() => setPasswordVisible(!passwordVisible)}
						style={{marginLeft: 10, display: "flex", alignItems: "center"}}
					>
						{passwordVisible ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye"></i>}
					</div>
				</div>
				{store.loginError && <div className={cl.login_error}>{store.loginError}</div>}
				<div style={{
					display: "flex",
					alignItems: 'center',
					justifyContent: 'space-evenly'
				}}>
					<button
						type="submit"
						className={cl.login_page__login_button}
						disabled={!password || !email}
						title={titleForButton}
					>
						Войти
					</button>
				</div>

			</form>
			<button className={cl.login_page__login_button + " " + cl.btn_register_color}
							onClick={() => {
								store.setLoginError(null);
								setIsRegistrationOpen(true);
							}}>
				Зарегистрироваться
			</button>
		</div>
	);
};

LoginForm.propTypes = {
	setIsRegistrationOpen: PropTypes.func.isRequired,
	cursorX: PropTypes.number.isRequired,
	cursorY: PropTypes.number.isRequired
}

export default LoginForm;