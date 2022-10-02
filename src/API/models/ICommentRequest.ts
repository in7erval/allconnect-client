export default interface ICommentRequest {
    text: string;
    userId: string | undefined;
    postId: string
}