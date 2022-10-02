import cl from './Login.module.css';
import React, {FC, useContext, useRef, useState} from "react";
import {Context} from "../../index";
import Input from "../../components/Input/Input";

interface LoginFormProperties {
    setIsRegistrationOpen: (_value: boolean) => void;
}

const LoginForm: FC<LoginFormProperties> = ({setIsRegistrationOpen}) => {

    const reference = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const {store} = useContext(Context);

    const sendData = async (event_: React.FormEvent) => {
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
                    <Input
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
                <div className={cl.login_form__input_group}
                     style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Input
                        id="current-password"
                        placeholder="Пароль"
                        required={true}
                        autoFocus={false}
                        autoComplete="password"
                        type={passwordVisible ? "text" : "password"}
                        onChange={event_ => setPassword(event_.target.value)}
                        value={password}
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

export default LoginForm;