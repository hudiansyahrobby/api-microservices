import { Router } from 'express';
import {
    resizeImages,
    prepareImages,
    saveImages,
    getImageById,
    deleteImageById,
    getImageByProductId,
    deleteImageByProductId,
} from '../controllers/image.controller';

const router: Router = Router();

router.post('/images', prepareImages, resizeImages, saveImages);

router.get('/images/:id', getImageById);

router.get('/images/products/:productId', getImageByProductId);

router.delete('/images/products/:productId', deleteImageByProductId);

router.delete('/images/:id', deleteImageById);

export default router;
