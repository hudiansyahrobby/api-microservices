import { Router } from 'express';
import {
    resizeImages,
    prepareImages,
    saveImages,
    getImageById,
    deleteImageById,
} from '../controllers/image.controller';

const router: Router = Router();

router.post('/images', prepareImages, resizeImages, saveImages);

router.get('/images/:id', getImageById);

router.delete('/images/:id', deleteImageById);

export default router;
