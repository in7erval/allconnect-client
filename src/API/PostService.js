import {$authApi} from "./index";

const PostService = {

	getAllForUser: (userId, limit = 10, page = 1) => {
		return $authApi.get(`/posts`, {
			params: {
				limit: limit,
				page: page,
				owner: true,
				comments: true,
				userId: userId
			}
		});
	},

	addNewPost: async (userId, text, imageURL) => {
		return $authApi.post(`/posts`, {
			text, owner: userId, image: imageURL
		});
	},

	addLike: async (postId, userLikedId) => {
		return $authApi.post(`/posts/${postId}/likes?add`,
			{
				_id: postId,
				userId: userLikedId
			});
	},

	deleteLike: async (postId, userLikedId) => {
		return $authApi.post(`/posts/${postId}/likes?delete`,
			{
				userId: userLikedId
			});
	},

	delete: async(postId) => {
		return $authApi.post(`/posts/${postId}/delete`);
	}

};

export default PostService;