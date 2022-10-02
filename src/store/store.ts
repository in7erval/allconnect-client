import {makeAutoObservable} from "mobx";
import UserAuthService from "../API/UserAuthService";
import axios from 'axios';
import {SERVER_URI, TOKEN} from "../constants";
import Cookies from "universal-cookie/es6";
import IUserDto from "../models/IUserDto";
import {IMessageUserString} from "../models/IMessage";
import INotification from "../models/INotification";
import IUser from "../models/IUser";


export default class Store {
    user: IUserDto | null = null;
    isAuth = false;
    isLoading = false;
    errors: any[] = [];
    loginError = null;
    onlineUsers: IUser[] = [];
    unreadMessages: IMessageUserString[] = [];
    notifications: INotification[] = [];

    // ssEvents = null;

    constructor() {
        makeAutoObservable(this);
    }

    get userId() {
        return this.user?.id;
    }

    setUnreadMessages(messages: IMessageUserString[]) {
        this.unreadMessages = messages;
    }

    // initSSEvents(userId) {
    // 	this.ssEvents = new EventSource(`${SERVER_URI}/stream/${userId}`, {withCredentials: true});
    //
    // 	this.ssEvents.addEventListener('open', (event) => {
    // 		console.log(event);
    // 	});
    //
    // 	this.ssEvents.addEventListener('message', (event) => {
    // 		console.log(JSON.parse(event.data));
    // 	});
    // }

    get countUnreadMessages() {
        return this.unreadMessages.length;
    }

    setNotifications(notifications: INotification[]) {
        this.notifications = notifications;
    }

    addNotification(notification: INotification) {
        if (!this.notifications.some(value => value._id === notification._id)) {
            this.notifications = [notification, ...this.notifications];
        }
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUserDto | null) {
        this.user = user;
    }

    addError(error: any) {
        console.log('add new error', error);
        this.errors = [...this.errors, error];
    }

    setLoginError(error: any) {
        console.log('add new error', error);
        this.loginError = error;
    }

    deleteError(index: number) {
        this.errors = this.errors.filter((v, index_) => index_ !== index);
    }

    setOnlineUsers(onlineUsers: IUser[]) {
        this.onlineUsers = onlineUsers;
    }

    async login(email: string, password: string) {
        try {
            this.setLoginError(null);
            const response = await UserAuthService.login(email, password);
            console.log('login', response);
            localStorage.setItem(TOKEN, response.data.accessToken);
            const cookies = new Cookies();
            cookies.set("refreshToken", response.data.accessToken,
                {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});
            console.log("setCookie", cookies);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error) {
            console.error("ERROR", error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.setLoginError(error?.response?.data?.message);
        }
    }

    async registration(email: string, password: string, firstName: string, lastName: string) {
        try {
            this.setLoginError(null);
            const response = await UserAuthService.registration(email, password, firstName, lastName);
            console.log('registration', response);
            localStorage.setItem(TOKEN, response.data.accessToken);
            const cookies = new Cookies();
            cookies.set("refreshToken", response.data.accessToken,
                {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});
            console.log("setCookie", cookies);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error) {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.setLoginError(error?.response?.data?.message);
        }
    }

    async logout() {
        try {
            await UserAuthService.logout();
            this.setUser(null);
            this.setUnreadMessages([]);
            this.setOnlineUsers([]);
            localStorage.removeItem(TOKEN);
            this.setAuth(false);
        } catch (error) {
            console.log(error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            console.error(error.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${SERVER_URI}/api/refresh`,
                {withCredentials: true}
            );
            console.log("checkAuth", response);
            localStorage.setItem(TOKEN, response.data.accessToken);
            const cookies = new Cookies();
            cookies.set("refreshToken", response.data.accessToken,
                {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});
            console.log("setCookie", cookies);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error) {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            console.log(error.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}