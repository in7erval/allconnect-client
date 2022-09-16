import cl from './AsideNav.module.css';
import Nav from "../Nav";

const AsideNav = () => {
	return (
		<aside className={cl.aside_nav}>
				<Nav activeClassName={cl.active}/>
		</aside>
	);
};

export default AsideNav;