import fs from 'fs';
import { getPublicId } from './getPublicId';
import { deleteImageOnCloudinary, uploadToCloudinary } from './initCloudinary';

export const uploadImages = async (files: Array<string>): Promise<Array<string>> => {
    const imageURL: Array<string> = [];
    for (const file of files) {
        const path = `public/${file}`;
        const newPath = await uploadToCloudinary(path);
        imageURL.push(newPath as string);
        fs.unlinkSync(path);
    }

    return imageURL;
};

export const deleteImages = async (images: Array<string>) => {
    const public_ids = getPublicId(images);

    for (const public_id of public_ids) {
        await deleteImageOnCloudinary(public_id);
    }
};
