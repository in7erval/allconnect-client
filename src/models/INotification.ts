import IUser from "./IUser";
import IPost from "./IPost";

export interface IAdditionalInfo {
    post: IPost;
    user: IUser;
}

export default interface INotification {
    _id: string;
    type: string;
    forUser: IUser;
    seen: boolean;
    additionalInfo: IAdditionalInfo
}