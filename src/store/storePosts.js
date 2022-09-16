import {makeAutoObservable} from "mobx";


export default class StorePosts {
	reloadPosts = false;

	constructor() {
		makeAutoObservable(this);
	}

	setReloadPosts(reloadPosts) {
		this.reloadPosts = reloadPosts;
	}

}