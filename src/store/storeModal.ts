import {makeAutoObservable} from "mobx";
import IUserDataForModalImage from "../models/IUserDataForModalImage";


export default class StoreModalImage {
    showModal = false;
    imageUrl = "";
    userData: IUserDataForModalImage | null = null;
    type = "post";

    constructor() {
        makeAutoObservable(this);
    }

    setShowModal(showModal: boolean) {
        this.showModal = showModal;
    }

    setUserData(userData: IUserDataForModalImage) {
        this.userData = userData;
    }

    setImageUrl(imageUrl: string) {
        this.imageUrl = imageUrl;
    }

    initModal(imageUrl: string, userData: IUserDataForModalImage, type = "post") {
        this.showModal = true;
        this.imageUrl = imageUrl;
        this.userData = userData;
        this.type = type;
    }

}