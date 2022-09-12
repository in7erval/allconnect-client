import LoaderForUserPic from "../../UI/Loader/LoaderForUserPic";
import cl from "./MessageRoomCard.module.css";
import LoaderText from "../../UI/Loader/LoaderText";

const MessageRoomCardLoader = () => {

	return (
		<div className={cl.message_card}>
			<LoaderForUserPic/>
			<div className={cl.message_card_name}>
				<div style={{display: "flex", alignItems: "center", flexDirection: 'row', justifyContent: 'start'}}>
					<LoaderText/>
					<LoaderText/>
				</div>
				<div className={cl.message_preview}>
					<LoaderText/>
				</div>

			</div>
		</div>
	);
};

export default MessageRoomCardLoader;