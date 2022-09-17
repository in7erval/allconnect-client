import {useState} from "react";

export interface IUseFetching {
	fetching: (_data?: any) => void;
	isLoading: boolean;
	error: string;
}

export const useFetching = (callback: (_data: any) => Promise<void>): IUseFetching => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const fetching = async (data?: any) => {
		try {
			setIsLoading(true);
			setError("");
			await callback(data);
		} catch (error_: any) {
				setError(error_.message);
		} finally {
			setIsLoading(false);
		}
	}
	return {fetching, isLoading, error};
}