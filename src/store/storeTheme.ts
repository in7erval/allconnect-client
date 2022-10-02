import {makeAutoObservable} from "mobx";

export default class StoreTheme {
    theme = "";

    constructor() {
        makeAutoObservable(this);
    }

    setTheme(theme: string) {
        this.theme = theme;
    }

    initTheme() {
        const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme = defaultDark ? 'dark' : 'light';
        document.body?.querySelector("#app")?.setAttribute("data-theme",defaultDark ? 'dark' : 'light');
    }

}