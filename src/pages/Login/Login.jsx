import {useContext, useEffect, useRef, useState} from 'react';
// import mock from '../../assets/mock-iphone.png';
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import cl from "./Login.module.css";
import {MouseParallaxChild, MouseParallaxContainer} from "react-parallax-mouse";
import {Context} from "../../index";

const Login = () => {
	const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
	const [cursorX, setCursorX] = useState();
	const [cursorY, setCursorY] = useState(0);
	const reference = useRef();
	const {store} = useContext(Context);

	const returnToHome = () => {
		store.setLoginError(null);
		setIsRegistrationOpen(false);
	};

	useEffect(() => {
		const box = reference.current.getBoundingClientRect();
		const xCenter = (box.left + box.right) / 2
		const yCenter = (box.top + box.bottom) / 2
		setCursorX(xCenter);
		setCursorY(yCenter);
	}, []);

	return (
		<div
			className={cl.login_page}
			onMouseMove={event => {
				setCursorX(event.pageX);
				setCursorY(event.pageY);
			}}
			ref={reference}
		>

			{/*<div className={cl.login_page__info}>*/}
			{/*	<p className={cl.p_first}>Для мобильных устройств</p>*/}
			{/*	<p className={cl.p_second}>*/}
			{/*		Веб-приложение allconnect оптимизировано для работы на мобильных устройствах.*/}
			{/*		<br/>*/}
			{/*		Будьте на связи и оставайтесь в курсе новостей ваших друзей, где бы вы ни находились.*/}
			{/*	</p>*/}

			{/*	<div className={cl.login_page__mock_imgs}>*/}
			{/*		<img*/}
			{/*			src={mock}*/}
			{/*			width="400px"*/}
			{/*			className={cl.img_mock}*/}
			{/*			alt={"mock"}*/}
			{/*		/>*/}
			{/*		<img*/}
			{/*			src={mock}*/}
			{/*			width="400px"*/}
			{/*			className={cl.img_mock}*/}
			{/*			alt={"mock"}*/}
			{/*		/>*/}
			{/*	</div>*/}
			{/*</div>*/}
			<MouseParallaxContainer
				containerStyles={{
					width: '90%',
					height: '90%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
					zIndex: 2,
					overflow: "unset"
				}}
			>

				<MouseParallaxChild
					factorX={0.01}
					factorY={0.01}
				>
					{!isRegistrationOpen ?
						<LoginForm
							cursorX={cursorX}
							cursorY={cursorY}
							setIsRegistrationOpen={setIsRegistrationOpen}
						/>
						:
						<RegistrationForm returnToHome={returnToHome}/>}
				</MouseParallaxChild>

			</MouseParallaxContainer>

			<div
				style={{
					position: "fixed",
					top: cursorY - 100,
					left: cursorX - 100,
					width: 200,
					height: 200,
					borderRadius: '50%',
					backgroundColor: "#be961e",
					filter: 'blur(100px) invert(1)',
					zIndex: 1,
					pointerEvents: 'none',
					mixBlendMode: "multiply"
				}}
			>
			</div>
		</div>
	);
};

export default Login;