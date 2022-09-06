import {useState} from "react";
import convert from "heic2any";
import Compress from "browser-image-compression";
import fileService from "../API/FileService";

export const useFile = (isSingle) => {
	const [files, setFiles] = useState([]);
	const [loadingFile, setLoadingFile] = useState(false);
	const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

	const handleImageChange = async (event_) => {
		event_.preventDefault();

		let file = event_.target.files[0];
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
			file = await convert({
				blob: file,
				toType: 'image/jpeg',
				quality: 1
			});
		}

		await Compress(file, options)
			.then(compressedBlob => {
				compressedBlob.lastModifiedDate = new Date();
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

	const deleteImage = (indexToDelete) => {
		if (indexToDelete === undefined) {
			indexToDelete = 0;
		}
		setFiles(files.filter((_value, index) => index !== indexToDelete));
		setImagePreviewUrls(imagePreviewUrls.filter((_value, index) => index !== indexToDelete));
	}

	const loadImages = async (idForFile) => {
		let datas = [];
		if (files.length > 0) {
			for (let file of files) {
				const {data} = await fileService.upload(file, idForFile);
				datas.push(data.path);
			}
		}
		setFiles([]);
		setImagePreviewUrls([]);
		return datas
	}


	return [files, imagePreviewUrls, loadingFile, handleImageChange, deleteImage, loadImages];
}