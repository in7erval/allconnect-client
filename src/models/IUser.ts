export default interface IUser {
    _id: string;
    picture: string;
    firstName: string;
    lastName: string;
    textStatus: string;
    friends: IUser[];
}