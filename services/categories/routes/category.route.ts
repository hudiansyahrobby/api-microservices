import { Router } from 'express';
import { create, update, remove, get, getById } from '../controllers/category.controller';
import isValid from '../middlewares/isValid';
import CategoryValidation from '../validations/category.validation';

const router: Router = Router();

router.post('/categories', isValid(CategoryValidation.category, 'body'), create);

router.get('/categories/:categoryId', getById);

router.get('/categories', get);

router.put('/categories/:categoryId', isValid(CategoryValidation.category, 'body'), update);

router.delete('/categories/:categoryId', remove);

export default router;
