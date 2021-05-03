import { NextFunction, Request, Response } from 'express';
import {
    createCategory,
    deleteCategoryById,
    findCategoryById,
    findAllCategories,
    updateCategoryById,
} from '../services/category.services';
import CategoryType from '../interfaces/Category';
import { catchAsync } from '../errorHandler/catchAsync';

export const create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name }: CategoryType = req.body;
    const token = req.headers.authorization;

    const category = await createCategory(name, token);

    return res.status(201).json({ message: 'Category successfully created', data: category, status: 201 });
});

export const get = catchAsync(async (req: Request, res: Response) => {
    const categories = await findAllCategories();
    return res.status(200).json({ message: 'OK', data: categories, status: 200 });
});

export const getById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    const category = await findCategoryById(categoryId);

    return res.status(200).json({ message: 'OK', data: category, status: 200 });
});

export const update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const { name }: CategoryType = req.body;
    const token = req.headers.authorization;

    const updatedCategory: CategoryType = {
        name,
    };

    const _updatedCategory = await updateCategoryById(updatedCategory, categoryId, token);

    return res.status(200).json({
        message: 'Category updated successfully',
        data: _updatedCategory,
        status: 200,
    });
});

export const remove = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const token = req.headers.authorization;

    const deletedCategory = await deleteCategoryById(categoryId, token);

    return res.status(200).json({ message: 'Category deleted successfully', data: deletedCategory, status: 200 });
});
