import { Router } from 'express';
import isValid from '../middlewares/isValid';
import ProductValidation from '../validations/product.validation';
import {
    create,
    getProducts,
    getDetail,
    update,
    remove,
    createBulk,
    prepareImages,
} from '../controllers/product.controller';
import uploadFiles from '../helpers/initMulter';

const router: Router = Router();

router.post('/products', uploadFiles, isValid(ProductValidation.product, 'body'), create);

router.post('/products/create-bulk', createBulk);

router.get('/products', getProducts);

router.get('/products/:productId', getDetail);

router.put('/products/:productId', uploadFiles, isValid(ProductValidation.product, 'body'), update);

router.delete('/products/:productId', remove);

export default router;
