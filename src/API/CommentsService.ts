import {$authApi} from "./index";
import ICommentsResponse from "./models/ICommentsResponse";
import ICommentResponse from "./models/ICommentResponse";
import ICommentRequest from "./models/ICommentRequest";
import {AxiosResponse} from "axios";

const CommentsService = {

	getOne: async (postId: string): Promise<AxiosResponse<ICommentResponse>> => {
		return $authApi.get("/comment", {
			params: {
				postId
			}
		});
	},

	getAll: async (postId: string): Promise<AxiosResponse<ICommentsResponse>> => {
		return $authApi.get("/comments", {
			params: {
				limit: 1000,
				page: 1,
				postId: postId,
				owner: true
			}
		});
	},

	add: async (comment: ICommentRequest): Promise<void> => {
		return $authApi.post('/comments', comment);
	}

};

export default CommentsService;