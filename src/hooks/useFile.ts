import React, {useState} from "react";
import convert from "heic2any";
import Compress from "browser-image-compression";
import fileService from "../API/FileService";

export interface IUseFile {
	files: Blob[];
	imagePreviewUrls: string[];
	loadingFile: boolean;
	handleImageChange: (_event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
	deleteImage: (_index?: number) => void;
	loadImages: (_url: string) => Promise<string[]>;
}

export const useFile = (isSingle: boolean): IUseFile => {
	const [files, setFiles] = useState<Blob[]>([]);
	const [loadingFile, setLoadingFile] = useState(false);
	const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

	const handleImageChange = async (event_: React.ChangeEvent<HTMLInputElement>) => {
		event_.preventDefault();

		const element: HTMLInputElement = event_.target;
		if (element == null || element.files === null) return;

		let file = element.files[0];
		console.log("file", file);
		const filename = file.name;

		const options = {
			maxSizeMB: 0.5,
			useWebWorker: true
		};

		setLoadingFile(true);

		if (file.type.toLowerCase() === "image/heic" ||
			file.name.toLowerCase().endsWith('.heic')) {
			console.log("HEIC detected");
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			file = await convert({
				blob: file,
				toType: 'image/jpeg',
				quality: 1
			});
		}

		await Compress(file, options)
			.then(compressedBlob => {
				const convertedBlobFile = new File([compressedBlob],
					filename.toLowerCase().replace('.heic', '.jpg'),
					{
						type: file.type,
						lastModified: Date.now()
					});
				console.log(convertedBlobFile);
				if (isSingle) {
					setFiles([convertedBlobFile]);
					setImagePreviewUrls([URL.createObjectURL(compressedBlob)]);
				} else {
					setFiles(previous => [...previous, convertedBlobFile]);
					setImagePreviewUrls(previous => [...previous, URL.createObjectURL(compressedBlob)]);
				}
			})
			.catch(_error => {
				console.log("error while reading", _error);
				// Show the user a toast message or notification that something went wrong while compressing file
			});

		setLoadingFile(false);
	}

	const deleteImage = (indexToDelete?: number) => {
		if (indexToDelete === undefined) {
			indexToDelete = 0;
		}
		setFiles(files.filter((_value, index) => index !== indexToDelete));
		setImagePreviewUrls(imagePreviewUrls.filter((_value, index) => index !== indexToDelete));
	}

	const loadImages = async (idForFile : string): Promise<string[]> => {
		const datas = [];
		if (files.length > 0) {
			for (const file of files) {
				const {data} = await fileService.upload(file, idForFile);
				datas.push(data.path);
			}
		}
		setFiles([]);
		setImagePreviewUrls([]);
		return datas;
	}


	return {files, imagePreviewUrls, loadingFile, handleImageChange, deleteImage, loadImages};
}