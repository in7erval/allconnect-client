import {Link} from "react-router-dom";
import Logo from "./Logo/Logo";
import cl from "./Navbar.module.css";
import NotificationsNav from "./NotificationsNav/NotificationsNav";
import {observer} from "mobx-react-lite";
import {useContext} from "react";
import {Context} from "../../index";

const Navbar = () => {
	const {store} = useContext(Context);

	const logout = () => {
		store.logout();
	}

	return store.isAuth ?
		(<nav className={cl.navbar}>
			<div className={cl.navbar__content}>
				<Link to="/"><Logo/></Link>
				{/*<SearchNav/>*/}

				<NotificationsNav/>
				<div className={cl.navbar__links}>
					<a className={cl.navbar_link} onClick={logout}>
						<i className="bi bi-box-arrow-right" style={{fontSize: "1.25rem"}}></i>
					</a>
				</div>

			</div>
		</nav>) : <></>;
};

export default observer(Navbar);