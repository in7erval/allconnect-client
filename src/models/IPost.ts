import IUser from "./IUser";
import IComment from "./IComment";

interface IPostDefault {
    _id: string,
    image?: string | null;
    likes: IUser[] | string[];
    text: string;
    owner: IUser;
    comments: IComment[] | string[];
    publishDate: string;
}

export default interface IPost extends IPostDefault {
    likes: IUser[];
    comments: IComment[];
}

export interface IPostLikes extends IPostDefault {
    likes: IUser[];
    comments: string[];
}

export interface IPostComments extends IPostDefault {
    likes: string[];
    comments: IComment[];
}