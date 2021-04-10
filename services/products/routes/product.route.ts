import { Router } from 'express';
import isValid from '../middlewares/isValid';
import ProductValidation from '../validations/product.validation';
import { create, getProducts, getDetail, update, remove, createBulk } from '../controllers/product.controller';

const router: Router = Router();

router.post('/products', isValid(ProductValidation.product, 'body'), create);

// router.post('/products', isValid(ProductValidation.product, 'body'), create);

router.post('/products/create-bulk', createBulk);

router.get('/products', getProducts);

router.get('/products/:productId', getDetail);

router.put('/products/:productId', isValid(ProductValidation.product, 'body'), update);

router.delete('/products/:productId', remove);

export default router;
