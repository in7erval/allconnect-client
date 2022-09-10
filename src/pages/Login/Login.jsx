import {useEffect, useRef, useState} from 'react';
// import mock from '../../assets/mock-iphone.png';
import LoginDefault from "./LoginDefault";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import cl from "./Login.module.css";
import {MouseParallaxChild, MouseParallaxContainer} from "react-parallax-mouse";

const Login = () => {
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
	const [cursorX, setCursorX] = useState();
	const [cursorY, setCursorY] = useState(0);
	const reference = useRef();

	const returnToHome = () => {
		setIsLoginOpen(false);
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
			<div
				style={{
					position: "absolute",
					top: cursorY - 50,
					left: cursorX - 50,
					width: 100,
					height: 100,
					borderRadius: '50%',
					backgroundColor: "royalblue",
					filter: 'blur(70px)',
					zIndex: 1,
					pointerEvents: 'none'
				}}
			>
			</div>
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
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
					zIndex: 2,
				}}
			>
				{!isLoginOpen && !isRegistrationOpen &&
					<MouseParallaxChild
						factorX={0.05}
						factorY={0.05}
					>
						<LoginDefault
							cursorX={cursorX}
							cursorY={cursorY}
							setIsLoginOpen={setIsLoginOpen}
							setIsRegistrationOpen={setIsRegistrationOpen}/>
					</MouseParallaxChild>

				}
				{isLoginOpen ?
					<LoginForm returnToHome={returnToHome}/>
					: (isRegistrationOpen && <RegistrationForm returnToHome={returnToHome}/>)
				}
			</MouseParallaxContainer>
		</div>
	);
};

export default Login;