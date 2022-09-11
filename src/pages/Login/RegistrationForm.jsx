import {useContext, useState} from 'react';
import cl from './Login.module.css';
import PropTypes from 'prop-types';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const RegistrationForm = ({returnToHome}) => {

	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const {store} = useContext(Context);

	const sendData = async (event_) => {
		event_.preventDefault();
		await store.registration(email, password, name, surname);
	}

	return (
		<div className={cl.login_page__login}>
			<div className={cl.login_page__login_title}>
				Регистрация в allconnect
			</div>
			<form className={cl.registration_form} onSubmit={sendData}>
				<div className={cl.login_form__input_group}>
					<label htmlFor="firstname">Имя</label>
					<input
						id="firstname"
						type="text"
						autoFocus={true}
						required

						onChange={event_ => setName(event_.target.value)}
					/>
				</div>
				<div className={cl.login_form__input_group}>
					<label htmlFor="lastname">Фамилия</label>
					<input
						id="lastname"
						type="text"
						autoFocus={true}
						required
						onChange={event_ => setSurname(event_.target.value)}
					/>
				</div>
				<div className={cl.login_form__input_group}>
					<label htmlFor="username">Электронная почта</label>
					<input
						id="username"
						type="email"
						autoFocus={true}
						required
						onChange={event_ => setEmail(event_.target.value)}
					/>
				</div>
				<div className={cl.login_form__input_group}>
					<div className={cl.login_form__password_and_pic}>
						<label htmlFor="new-password">Пароль</label>
						<div onClick={() => setPasswordVisible(!passwordVisible)}>
							{passwordVisible ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye"></i>}
						</div>
					</div>
					<input
						id="new-password"
						required
						type={passwordVisible ? "text" : "password"}
						onChange={event_ => setPassword(event_.target.value)}
						className={passwordVisible ? "" : "ls-5"}
					/>
				</div>
				<div style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-evenly',
					marginTop: 20
				}}>
					<button
						className={cl.btn_return}
						onClick={returnToHome}
					>
						<i className="bi bi-caret-left"></i>
					</button>
					<button
						type="submit"
						className={cl.login_page__login_button + " " + cl.btn_register_color}
					>
						Зарегистрироваться
					</button>
				</div>
			</form>

		</div>
	);
};

RegistrationForm.propTypes = {
	returnToHome: PropTypes.func.isRequired
}

export default observer(RegistrationForm);