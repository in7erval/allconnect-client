import cl from "./Logo.module.css";

const Logo = () => {
	return (
		<div className={cl.logo_all}>
			{/*<img src={logo} alt="logo" className={cl.logo_img}/>*/}
			<p className={cl.logo_text}>
				allconnect
			</p>
			<p className={cl.logo_text_small}>
				a
			</p>
		</div>
	);
};

export default Logo;