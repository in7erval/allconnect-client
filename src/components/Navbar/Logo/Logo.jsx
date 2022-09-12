import cl from "./Logo.module.css";

const Logo = () => {
	return (
		<div className={cl.logo_all}>
			<p className={cl.logo_text}>
				a<span>llconnect</span>
			</p>
		</div>
	);
};

export default Logo;