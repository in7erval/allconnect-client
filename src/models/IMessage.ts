import IUser from "./IUser";

export default interface IMessage {
    _id: string;
    picture: string;
    user: IUser;
    createdAt: string;
    continuous: boolean;
    seenBy: string[];
    text: string;
    pictures: string[];
    roomId: string;
}