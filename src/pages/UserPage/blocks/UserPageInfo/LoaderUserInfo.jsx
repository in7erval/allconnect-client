import cl from "./UserPageInfo.module.css";
import LoaderForImage from "../../../../components/UI/Loader/LoaderForImage";
import LoaderText from "../../../../components/UI/Loader/LoaderText";
import {Link} from "react-router-dom";

const LoaderUserInfo = () => {
	return (
		<div className={cl.user_page__pic_name}>
			<div className={cl.user_page__pic_and_btns}>
				<div className={cl.user_pic}>
					<LoaderForImage/>
				</div>
			</div>
			<div className={cl.user_page__info_stats}>
				<div className={cl.user_page__info}>
					<div style={{
						display: "flex",
						flexDirection: "row",
						marginBottom: 10,
						width: '100%',
						justifyContent: "space-evenly"
					}}>
						<LoaderText/>
						<LoaderText/>
					</div>
					<div style={{backgroundColor: "lightgray", width: "100%", height: 1}}></div>
					<div style={{marginTop: 10}}>
						<LoaderText/>
					</div>
				</div>
				<div className={cl.user_page__stats}>
					<Link to={`#`}>
						<LoaderText/>
						{/*<div>{userResponse.data?.friends?.length}</div>*/}
						<p>друзей</p>
					</Link>
					<Link to="#" aria-disabled={true} className={cl.disabled_link}>
						<LoaderText/>
						<p>записей</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoaderUserInfo;