import React, {FC, useContext, useState} from 'react';
import cl from './Login.module.css';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import Input from "../../components/Input/Input";

interface RegistrationForm {
    returnToHome: () => void;
}

const RegistrationForm: FC<RegistrationForm> = ({returnToHome}) => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const {store} = useContext(Context);

    const sendData = async (event_: React.FormEvent) => {
        event_.preventDefault();
        await store.registration(email, password, name, surname);
    }

    return (
        <div className={cl.login_page__login}>
            <div className={cl.login_page__login_title}>
                Регистрация в <span>allconnect</span>
            </div>
            <form className={cl.registration_form} onSubmit={sendData}>
                <div className={cl.login_form__input_group}>
                    <Input
                        id={"firstname"}
                        type={"text"}
                        autoFocus={true}
                        required={true}
                        autoComplete={'firstname'}
                        placeholder={'Имя'}
                        value={name}
                        onChange={event_ => setName(event_.target.value)}
                    />
                </div>
                <div className={cl.login_form__input_group}>
                    <Input
                        id={"lastname"}
                        type={"text"}
                        autoFocus={true}
                        required={true}
                        autoComplete={"lastname"}
                        placeholder={"Фамилия"}
                        value={surname}
                        onChange={event_ => setSurname(event_.target.value)}
                    />
                </div>
                <div className={cl.login_form__input_group}>
                    <Input
                        id={"username"}
                        type={"email"}
                        autoFocus={true}
                        required={true}
                        autoComplete={"username"}
                        placeholder={"Электронная почта"}
                        value={email}
                        onChange={event_ => setEmail(event_.target.value)}
                    />
                </div>
                <div className={cl.login_form__input_group}
                     style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Input
                        id={"new-password"}
                        type={passwordVisible ? "text" : "password"}
                        autoFocus={true}
                        required={true}
                        autoComplete={"new-password"}
                        placeholder={"Пароль"}
                        value={password}
                        onChange={event_ => setPassword(event_.target.value)}
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

export default observer(RegistrationForm);