import IUser from "./IUser";

interface IMessageDefault {
    _id: string;
    picture: string;
    createdAt: string;
    continuous: boolean;
    seenBy: string[];
    text: string;
    pictures: string[];
    roomId: string;
}

export default interface IMessage extends IMessageDefault {
    user: IUser;
}

export interface IMessageUserString extends IMessageDefault {
    user: string;
}