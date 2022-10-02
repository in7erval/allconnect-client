import {$authApi} from './index';

const TeleTokenService = {

	getTokenData: async (userId) => {
		return $authApi.get('/telegram/getTokenData', {params: {userId: userId}});
	},

	getToken: async (userId) => {
		return $authApi.get('/telegram/getToken', {params: {userId: userId}});
	},

	updateToken: async (userId) => {
		return $authApi.get('/telegram/updateToken', {params: {userId: userId}});
	}

	// registration: async (email, password, firstName, lastName) => {
	// 	return $authApi.post('/registration', {email, password, firstName, lastName});
	// },
	//
	// logout: async () => {
	// 	return $authApi.post('/logout');
	// },

};

export default TeleTokenService;