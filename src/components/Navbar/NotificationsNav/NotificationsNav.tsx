import {useContext, useState} from "react";
import cl from "./NotificationsNav.module.css";
import {createPortal} from "react-dom";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import LoadingImage from "../../UI/LoadingImage/LoadingImage";
import LoaderForUserPic from "../../UI/Loader/LoaderForUserPic";


const postText = (text: string, action: string) => {
	if (text.length > (action === "COMMENT" ? 30 : 20)) {
		return text.slice(0, (action === "COMMENT" ? 17 : 27)) + "...";
	}
	return text;
}

const mapActionToText = (action: string) => {
	if (action === "LIKE") {
		return "поставил лайк записи";
	} else if (action === "COMMENT") {
		return "оставил комментарий к записи";
	} else {
		return action;
	}
};

const NotificationsNav = () => {

	const [show, setShow] = useState<boolean>(false);
	const {store} = useContext(Context);

	const mapActionToSVG = (action: string) => {
		if (action === "LIKE") {
			return (<i className="bi bi-heart-fill" style={{color: "red"}}></i>);
		} else if (action === "COMMENT") {
			return (<i className="bi bi-chat-left-dots"></i>);
		} else {
			return action;
		}
	}

	return (
		<div className={cl.main}>
			<button
				type="button"
				onClick={() => setShow(!show)}
				className={show ? cl.active : cl.not_active}
			>
				Уведомления {store.notifications.length}
			</button>
			{show && createPortal(
				<div className={cl.behind} onClick={() => setShow(false)}>
					<div className={cl.notifications} onClick={event => event.stopPropagation()}>
						<div className={cl.notifications_content}>
							{store.notifications.length === 0 ?
								<div>Уведомлений нет</div>
								:
								(store.notifications.map(notification => (
									<div key={notification._id}>
										<div style={{marginRight: 10}}>
											{mapActionToSVG(notification.type)}
										</div>
										<div className={cl.user_pic}>
											<LoadingImage
												showWhenLoading={<LoaderForUserPic/>}
												src={notification.additionalInfo.user.picture}
												alt={"Изображение недоступно"}
											/>
										</div>
										<p style={{fontSize: '0.75rem'}}>
											{notification.additionalInfo.user.firstName} {notification.additionalInfo.user.lastName} {mapActionToText(notification.type)} &quot;{postText(notification.additionalInfo.post.text, notification.type)}&quot;
										</p>
									</div>
								)))
							}
						</div>
					</div>
				</div>,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				document.querySelector("#app")
			)}
		</div>
	);
};

export default observer(NotificationsNav);