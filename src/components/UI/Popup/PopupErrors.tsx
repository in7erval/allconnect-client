import cl from "./Popup.module.css";
import {useContext} from "react";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";

const PopupErrors = () => {

	const {store} = useContext(Context);

	console.log("errors in popup", store.errors);

	const deleteError_ = (key: number) => {
		store.deleteError(key);
	}

	return store.errors && (
		<div className={cl.popups}>
			{store.errors.map((element, index) =>
				(
					<div key={index} className={cl.popup} onClick={() => deleteError_(index)}>
						<p className={cl.helper}>X</p>
						{element.message}
					</div>
				)
			)}

		</div>

	);
};

export default observer(PopupErrors);