import Image from '../models/image.model';
import axios from 'axios';
import sharp from 'sharp';
import { uploadImages } from '../helpers/images';
import { getPublicId } from '../helpers/getPublicId';
import AppError from '../errorHandler/AppError';
import { deleteImageOnCloudinary } from '../helpers/initCloudinary';

export const findImageById = async (id: string) => {
    const image = await Image.findByPk(id)

    if (!image) {
        throw new AppError(`Image with id ${id} not found`, 404, 'not-found'));
    }

    return image;
};

export const findImageByProductId = (productId: string) => {
    return Image.findAll({ where: { productId } });
};

export const destroyImageByProductId = async (productId: string, token: string | undefined) => {

    await checkAuth(token);
    const images = await findImageByProductId(productId);

    if (images.length === 0) {
        throw new AppError(`Image with product ID ${productId} not found`, 404, 'not-found');
    }

    await Image.destroy({ where: { productId } });
    return images
};

export const destroyImageById = async (id: string, token: string | undefined) => {
    await checkAuth(token);
    const image = await findImageById(id);

    if (!image) {
        throw new AppError(`Image with id ${id} not found`, 404, 'not-found');
    }

    await removeImageOnDB(id);
    await deleteImageOnCloudinary(image.imageId);

    return image
};

export const removeImageOnDB = (id: string) => {
    return Image.destroy({
        where: {
            id,
        },
    });
};

export const formatImage = (image: any, filename: string, formatTo: 'jpeg' | 'webp') => {
    return sharp(image).resize(640, 320).toFormat(formatTo).jpeg({ quality: 80 }).toFile(`public/${filename}`);
};

export const changeImageSize = async (
    images:
        | {
              [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[],
) => {
    const imagesArray: any = [];
    await Promise.all(
        (images as any).map(async (file: any) => {
            // Delete extension file name
            const filename = file.originalname.replace(/\..+$/, '');

            const newFilenameOnJPG = `${filename}-${Date.now()}.jpeg`;
            const newFilenameOnWebp = `${filename}-${Date.now()}.webp`;

            await formatImage(file.buffer, newFilenameOnJPG, 'jpeg');
            await formatImage(file.buffer, newFilenameOnWebp, 'webp');

            imagesArray.push(newFilenameOnJPG, newFilenameOnWebp);
        }),
    );

    return imagesArray;
};

export const saveAndUploadImages = async (images: any, product_id: string) => {
    const imageURLs = await uploadImages(images);
    const imageIds = getPublicId(imageURLs);

    const savedImages = [];

    for (let index = 0; index < imageURLs.length; index++) {
        savedImages.push(Image.create({ imageId: imageIds[index], imageUrl: imageURLs[index], productId: product_id }));
    }

    const _savedImages = await Promise.all(savedImages);
    return _savedImages;
};

export const checkAuth = async (token: string | undefined) => {
    let headersConfig = {};
    if (token) {
        headersConfig = {
            authorization: token,
        };
    }
    const response = await axios.post(
        `http://authentication:8081/api/v1/auth/check-auth`,
        {},
        {
            headers: headersConfig,
        },
    );
    const uid = response.data.data.uid;
    return uid;
};
