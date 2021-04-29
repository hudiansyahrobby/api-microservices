import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import multer from 'multer';
import uploadFiles from '../helpers/initMulter';
import { uploadImages } from '../helpers/images';
import { logger } from '../helpers/logger';
import Image from '../models/image.model';
import { getPublicId } from '../helpers/getPublicId';
import {
    findImageById,
    findImageByProductId,
    removeImageOnDB,
    destroyImageByProductId,
    checkAuth,
} from '../services/image.services';
import { deleteImageOnCloudinary } from '../helpers/initCloudinary';
import { catchAsync } from '../errorHandler/catchAsync';
import AppError from '../errorHandler/AppError';

export const prepareImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    await checkAuth(token);
    uploadFiles(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return next(new AppError('Too many files to upload. Max is 5 images', 422, 'validation-error'));
            }
        } else if (err) {
            return next(new AppError(err?.message, 400, 'bad-request'));
        }
        if (req.files.length === 0) {
            return next(new AppError('Upload at least one image', 422, 'validation-error'));
        }

        next();
    });
});

export const resizeImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.body.images = [];
    await Promise.all(
        (req.files as any).map(async (file: any) => {
            // Delete extension file name
            const filename = file.originalname.replace(/\..+$/, '');

            const newFilenameOnJPG = `${filename}-${Date.now()}.jpeg`;
            const newFilenameOnWebp = `${filename}-${Date.now()}.webp`;

            await sharp(file.buffer)
                .resize(640, 320)
                .toFormat('jpeg')
                .jpeg({ quality: 80 })
                .toFile(`public/${newFilenameOnJPG}`);

            await sharp(file.buffer)
                .resize(640, 320)
                .toFormat('webp')
                .webp({ quality: 80 })
                .toFile(`public/${newFilenameOnWebp}`);

            req.body.images.push(newFilenameOnJPG, newFilenameOnWebp);
        }),
    );

    next();
});

export const saveImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { images } = req.body;

    const imageURLs = await uploadImages(images);
    const imageIds = getPublicId(imageURLs);

    const savedImages = [];

    for (let index = 0; index < imageURLs.length; index++) {
        savedImages.push(
            Image.create({ imageId: imageIds[index], imageUrl: imageURLs[index], productId: req.body.product_id }),
        );
    }

    const _savedImages = await Promise.all(savedImages);

    return res.status(201).json({ message: 'Image successfully saved', data: _savedImages, status: 201 });
});

export const getImageById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const image = await findImageById(id);

    if (!image) {
        return next(new AppError(`Image with id ${id} not found`, 404, 'not-found'));
    }

    return res.status(201).json({ message: 'OK', data: image, status: 200 });
});

export const getImageByProductId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const image = await findImageByProductId(productId);

    return res.status(200).json({ message: 'OK', data: image, status: 200 });
});

export const deleteImageByProductId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const token = req.headers.authorization;

    await checkAuth(token);
    const images = await findImageByProductId(productId);

    if (images.length === 0) {
        return next(new AppError(`Image with product ID ${productId} not found`, 404, 'not-found'));
    }

    await destroyImageByProductId(productId);

    return res.status(200).json({ message: 'OK', data: images, status: 200 });
});

export const deleteImageById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const token = req.headers.authorization;

    await checkAuth(token);
    const image = await findImageById(id);

    if (!image) {
        return next(new AppError(`Image with id ${id} not found`, 404, 'not-found'));
    }

    await removeImageOnDB(id);
    await deleteImageOnCloudinary(image.imageId);

    return res.status(201).json({ message: 'Image successfully deleted', data: image, status: 200 });
});
