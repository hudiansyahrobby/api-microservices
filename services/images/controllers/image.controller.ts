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
} from '../services/image.services';
import { deleteImageOnCloudinary } from '../helpers/initCloudinary';

export const prepareImages = (req: Request, res: Response, next: NextFunction) => {
    uploadFiles(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(422).json({
                    message: 'Too many files to upload. Max is 5 images',
                    status: 422,
                    error: {
                        message: 'Too many files to upload. Max is 5 images',
                        type: 'too-many-files',
                    },
                });
            }
        } else if (err) {
            logger.log({ level: 'error', message: err });
            return res.status(422).json({
                message: err,
                status: 422,
                error: {
                    message: err,
                    type: 'bad-request',
                },
            });
        }
        if (req.files.length === 0) {
            return res.status(422).json({
                message: 'Upload at least one image',
                status: 422,
                error: {
                    message: 'Upload at least one image',
                    type: 'no-image',
                },
            });
        }

        next();
    });
};

export const resizeImages = async (req: Request, res: Response, next: NextFunction) => {
    req.body.images = [];

    try {
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
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'Server error',
            },
        });
    }
};

export const saveImages = async (req: Request, res: Response, next: NextFunction) => {
    const { images } = req.body;

    try {
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
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'Server error',
            },
        });
    }
};

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const image = await findImageById(id);

        if (!image) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Image with id ${id} not found`,
                    type: 'Not Found',
                },
            });
        }

        return res.status(201).json({ message: 'OK', data: image, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'Server error',
            },
        });
    }
};

export const getImageByProductId = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    try {
        const image = await findImageByProductId(productId);

        return res.status(200).json({ message: 'OK', data: image, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'Server error',
            },
        });
    }
};

export const deleteImageByProductId = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    try {
        const images = await findImageByProductId(productId);
        if (images.length === 0) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Image with product ID ${productId} not found`,
                    type: 'Not Found',
                },
            });
        }
        await destroyImageByProductId(productId);
        return res.status(200).json({ message: 'OK', data: images, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'Server error',
            },
        });
    }
};

export const deleteImageById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const image = await findImageById(id);

        if (!image) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Image with id ${id} not found`,
                    type: 'Not Found',
                },
            });
        }

        await removeImageOnDB(id);
        await deleteImageOnCloudinary(image.imageId);

        return res.status(201).json({ message: 'Image successfully deleted', data: image, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'Server error',
            },
        });
    }
};
