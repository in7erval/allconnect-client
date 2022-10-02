import IComment from "../../models/IComment";

export default interface ICommentsResponse {
    body: IComment[];
    count: number;
}