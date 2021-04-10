import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { getPagination } from '../helpers/getPagination';
import { getPaginationData } from '../helpers/getPaginationData';
import { getSort } from '../helpers/getSort';
import {
    createProduct,
    getAllProducts,
    getProductbyId,
    updateProductById,
    deleteProductById,
    createBulkProducts,
} from '../services/product.services';
import ProductType from '../interfaces/Product';
import { logger } from '../helpers/logger';

export const create = async (req: any, res: Response) => {
    // const { categories, ...data } = req.body;

    try {
        const newProduct: ProductType = {
            ...req.body,
        };

        const createdProduct = await createProduct(newProduct);

        return res.status(201).json({ message: 'Created', data: createdProduct, status: 201 });
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

export const createBulk = async (req: any, res: Response) => {
    try {
        const newProducts: ProductType[] = {
            ...req.body,
        };

        const createdProducts = await createBulkProducts(newProducts);
        return res.status(201).json({ message: 'Created', data: createdProducts, status: 201 });
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

export const getProducts = async (req: Request, res: Response) => {
    const { page, size, search, sort } = req.query;

    const _page = parseInt(page as string);
    const _size = parseInt(size as string);

    const { limit, offset } = getPagination(_page, _size);

    // TODO : SEARCH BY CATEGORY
    const searchCondition = search
        ? {
              [Op.or]: [
                  {
                      name: { [Op.iLike]: `%${search}%` },
                  },
                  {
                      description: { [Op.iLike]: `%${search}%` },
                  },
              ],
          }
        : undefined;
    const orderBy = !!sort ? getSort(sort as string) : ['createdAt', 'DESC'];
    // const categoryCondition = categoryId ? { id: categoryId } : undefined;

    try {
        // const response = await getAllProducts(searchCondition, limit, offset, orderBy, categoryCondition);
        const response = await getAllProducts(searchCondition, limit, offset, orderBy);

        const products = getPaginationData(response, _page, limit);

        return res.status(200).json({
            message: 'OK',
            data: products.results,
            status: 200,
            meta: {
                count: products.totalItems,
                load: products.results.length,
                page: products.totalPages,
                offset: limit,
            },
        });
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

export const getDetail = async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        const product = await getProductbyId(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'Not Found',
                },
            });
        }

        return res.status(200).json({ message: 'OK', data: product, status: 200 });
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
export const update = async (req: any, res: Response) => {
    const { productId } = req.params;

    try {
        const product = await getProductbyId(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'Not Found',
                },
            });
        }

        const productData: ProductType = {
            ...req.body,
        };

        await updateProductById(productData, productId);

        const updatedProduct = await getProductbyId(productId);
        return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct, status: 200 });
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

export const remove = async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        const product = await getProductbyId(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'Not Found',
                },
            });
        }

        await deleteProductById(productId);

        return res.status(200).json({ message: 'Product Removed Successfully', data: product, status: 200 });
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
