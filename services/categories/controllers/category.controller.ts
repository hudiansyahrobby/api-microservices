import { Request, Response } from 'express';
import {
    createCategory,
    deleteCategoryById,
    findCategoryById,
    findAllCategories,
    updateCategoryById,
    checkAuth,
} from '../services/category.services';
import CategoryType from '../interfaces/Category';
import { logger } from '../helpers/logger';

export const create = async (req: Request, res: Response) => {
    const { name }: CategoryType = req.body;
    const token = req.headers.authorization;
    try {
        await checkAuth(token);
        const [category, created] = await createCategory(name);

        if (!created) {
            return res.status(400).json({
                message: 'Category has already exist',
                status: 400,
                error: {
                    message: `Category with name ${name} is already exist`,
                    type: 'Bad Request',
                },
            });
        }

        return res.status(201).json({ message: 'Category successfully created', data: category, status: 201 });
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

export const get = async (req: Request, res: Response) => {
    try {
        const categories = await findAllCategories();

        return res.status(200).json({ message: 'OK', data: categories, status: 200 });
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

export const getById = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
        const category = await findCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Category with id ${categoryId} not found`,
                    type: 'Not Found',
                },
            });
        }

        return res.status(200).json({ message: 'OK', data: category, status: 200 });
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

export const update = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { name }: CategoryType = req.body;
    const token = req.headers.authorization;
    try {
        await checkAuth(token);
        const category = await findCategoryById(categoryId);

        if (!category) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Category with id ${categoryId} not found`,
                    type: 'Not Found',
                },
            });
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
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        if (error.response?.status === 403) {
            return res.status(403).json({
                message: error.response.data.message,
                status: 403,
                error: {
                    message: error.response.data.message,
                    type: error.response.data.type,
                },
            });
        } else {
            return res.status(500).json({
                message: 'Internal Server Error',
                status: 500,
                error: {
                    message: 'Internal server error',
                    type: 'Server error',
                },
            });
        }
    }
};

export const remove = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const token = req.headers.authorization;
    try {
        await checkAuth(token);
        const category = await findCategoryById(categoryId);

        if (!category) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Category with id ${categoryId} not found`,
                    type: 'Not Found',
                },
            });
        }

        await deleteCategoryById(categoryId);

        return res.status(200).json({ message: 'Category deleted successfully', data: category, status: 200 });
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
