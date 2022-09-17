import {useContext, useEffect, useRef, useState} from 'react';
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import cl from "./Login.module.css";
import {MouseParallaxChild, MouseParallaxContainer} from "react-parallax-mouse";
import {Context} from "../../index";

const Login = () => {
	const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
	const [cursorX, setCursorX] = useState<number>(0);
	const [cursorY, setCursorY] = useState<number>(0);
	const reference = useRef<HTMLDivElement>(null);
	const {store} = useContext(Context);

	const returnToHome = () => {
		store.setLoginError(null);
		setIsRegistrationOpen(false);
	};

	useEffect(() => {
		const box = reference?.current?.getBoundingClientRect();
		if (box) {
			const xCenter = (box.left + box.right) / 2
			const yCenter = (box.top + box.bottom) / 2
			setCursorX(xCenter);
			setCursorY(yCenter);
		}
	}, []);

	useEffect(() => {
		document.title = 'Allconnect';
	});

	return (
		<div
			className={cl.login_page}
			onMouseMove={event => {
				setCursorX(event.pageX);
				setCursorY(event.pageY);
			}}
			ref={reference}
		>
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
							setIsRegistrationOpen={setIsRegistrationOpen}
						/>
						:
						<RegistrationForm returnToHome={returnToHome}/>}
				</MouseParallaxChild>
			</MouseParallaxContainer>
			<div
				style={{
					position: "fixed",
					top: (cursorY ?? 100) - 100,
					left: (cursorX ?? 100) - 100,
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