import {$authApi} from "./index";

const FileService = {

	upload: async (file, id) => {
		const formData = new FormData();
		formData.append('image', file);
		return $authApi.post(`/files/${id}/image`, formData,
			{
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
	},

};

export default FileService;