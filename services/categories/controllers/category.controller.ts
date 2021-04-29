import { NextFunction, Request, Response } from 'express';
import {
    createCategory,
    deleteCategoryById,
    findCategoryById,
    findAllCategories,
    updateCategoryById,
    checkAuth,
} from '../services/category.services';
import CategoryType from '../interfaces/Category';
import { catchAsync } from '../errorHandler/catchAsync';
import AppError from '../errorHandler/AppError';

export const create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name }: CategoryType = req.body;
    const token = req.headers.authorization;
    await checkAuth(token);
    const [category, created] = await createCategory(name);

    if (!created) {
        return next(new AppError(`Category with name ${name} is already exist`, 400, 'bad-request'));
    }

    return res.status(201).json({ message: 'Category successfully created', data: category, status: 201 });
});

export const get = catchAsync(async (req: Request, res: Response) => {
    const categories = await findAllCategories();
    return res.status(200).json({ message: 'OK', data: categories, status: 200 });
});

export const getById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    const category = await findCategoryById(categoryId);
    if (!category) {
        return next(new AppError(`Category with id ${categoryId} not found`, 404, 'not-found'));
    }

    return res.status(200).json({ message: 'OK', data: category, status: 200 });
});

export const update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const { name }: CategoryType = req.body;
    const token = req.headers.authorization;
    await checkAuth(token);
    const category = await findCategoryById(categoryId);

    if (!category) {
        return next(new AppError(`Category with id ${categoryId} not found`, 404, 'not-found'));
    }

    const updatedCategory: CategoryType = {
        name,
    };

    const [_, _updatedCategory] = await updateCategoryById(updatedCategory, categoryId);

    return res.status(200).json({
        message: 'Category updated successfully',
        data: _updatedCategory[0],
        status: 200,
    });
});

export const remove = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const token = req.headers.authorization;
    await checkAuth(token);
    const category = await findCategoryById(categoryId);

    if (!category) {
        return next(new AppError(`Category with id ${categoryId} not found`, 404, 'not-found'));
    }

    await deleteCategoryById(categoryId);

    return res.status(200).json({ message: 'Category deleted successfully', data: category, status: 200 });
});
