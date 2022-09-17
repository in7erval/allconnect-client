import IUser from "./IUser";
import IPost from "./IPost";

export default interface IComment {
    _id: string,
    message: string,
    owner: IUser,
    post: string | IPost,
    publishDate: string,
    continuous: boolean;
}