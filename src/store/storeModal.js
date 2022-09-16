import {makeAutoObservable} from "mobx";


export default class StoreModalImage {
	showModal = false;
	imageUrl = "";
	userData = {};
	type = "post";

	constructor() {
		makeAutoObservable(this);
	}

	setShowModal(showModal) {
		this.showModal = showModal;
	}

	setUserData(userData) {
		this.userData = userData;
	}

	setImageUrl(imageUrl) {
		this.imageUrl = imageUrl;
	}

	initModal(imageUrl, userData, type = "post") {
		this.showModal = true;
		this.imageUrl = imageUrl;
		this.userData = userData;
		this.type = type;
	}

}