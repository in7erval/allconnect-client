import IComment from "../../models/IComment";

export default interface ICommentResponse {
    body: IComment;
    count: number;
}