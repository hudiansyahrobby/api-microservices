import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import uploadFiles from '../helpers/initMulter';
import {
    findImageById,
    findImageByProductId,
    destroyImageByProductId,
    checkAuth,
    changeImageSize,
    saveAndUploadImages,
    destroyImageById,
} from '../services/image.services';
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
    const images = req.files;
    const changedImages = await changeImageSize(images);
    req.body.images = changedImages;
    next();
});

export const saveImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { images, product_id } = req.body;
    const savedImages = await saveAndUploadImages(images, product_id);

    return res.status(201).json({ message: 'Image successfully saved', data: savedImages, status: 201 });
});

export const getImageById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const image = await findImageById(id);
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

    const images = await destroyImageByProductId(productId, token);

    return res.status(200).json({ message: 'OK', data: images, status: 200 });
});

export const deleteImageById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const token = req.headers.authorization;
    const image = await destroyImageById(id, token);
    return res.status(201).json({ message: 'Image successfully deleted', data: image, status: 200 });
});
