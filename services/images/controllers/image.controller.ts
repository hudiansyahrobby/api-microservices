import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import multer from 'multer';
import uploadFiles from '../helpers/initMulter';
import { uploadImages } from '../helpers/images';
import { logger } from '../helpers/logger';
import Image from '../models/image.model';
import { getPublicId } from '../helpers/getPublicId';
import { findImageById, removeImageOnDB } from '../services/image.services';
import { deleteImageOnCloudinary } from '../helpers/initCloudinary';

export const prepareImages = (req: Request, res: Response, next: NextFunction) => {
    uploadFiles(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(422).json({ message: 'Too many files to upload. Max is 5 images' });
            }
        } else if (err) {
            return res.status(400).json({ message: err });
        }

        if (req.files.length === 0) {
            return res.status(422).json({ message: 'Upload at least one image' });
        }

        next();
    });
};

export const resizeImages = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next();

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
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const saveImages = async (req: Request, res: Response, next: NextFunction) => {
    const { images } = req.body;

    try {
        const imageURLs = await uploadImages(images);
        const imageIds = getPublicId(imageURLs);

        const savedImages = [];

        for (let index = 0; index < imageURLs.length; index++) {
            savedImages.push(Image.create({ imageId: imageIds[index], imageUrl: imageURLs[index] }));
        }

        const _savedImages = await Promise.all(savedImages);

        return res.status(201).json({ message: 'Image successfully uploaded', savedImages: _savedImages });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const image = await findImageById(id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        return res.status(200).json({ image });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteImageById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const image = await findImageById(id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        await removeImageOnDB(id);
        await deleteImageOnCloudinary(image.imageId);

        return res.status(200).json({ message: 'Image successfully deleted', image });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal server error' });
    }
};
