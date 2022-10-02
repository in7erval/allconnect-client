import {IPostComments} from "./IPost";

export default interface IPostResponse {
    body: IPostComments[],
    count: number;
}
