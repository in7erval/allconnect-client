import IUser from "./IUser";
import IComment from "./IComment";

export default interface IPost {
    _id: string,
    image?: string | null;
    likes: IUser[] | string[];
    text: string;
    owner: IUser;
    comments: IComment[] | string[];
    publishDate: string;
}