import { NextFunction, Request, Response } from 'express';
import {
    createProduct,
    getAllProducts,
    getProductbyId,
    updateProductById,
    deleteProductById,
    createBulkProducts,
    uploadProductImage,
    getCategoryById,
    getImageByProductId,
    deleteImageByProductId,
    checkAuth,
} from '../services/product.services';
import { ProductType } from '../types/ProductType';
import { logger } from '../helpers/logger';
import uploadFiles from '../helpers/initMulter';

export const prepareImages = (req: Request, res: Response, next: NextFunction) => {
    uploadFiles(req, res, (err: any) => {
        next();
    });
};

export const create = async (req: Request, res: Response) => {
    const { categoryId } = req.body;
    const token = req.headers.authorization;
    try {
        await checkAuth(token);
        const newProduct: ProductType = {
            ...req.body,
        };
        const category = await getCategoryById(categoryId);
        const product = await createProduct(newProduct);
        const images = await uploadProductImage(req.files, product.id, token);
        product.setDataValue('images', images.data.data);
        product.setDataValue('categoryName', category.data.data.name);

        return res.status(201).json({
            message: 'Product successfully created',
            data: { product: product },
            status: 201,
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
        } else if (error.response?.status === 404) {
            return res.status(404).json({
                message: error.response.data.message,
                status: 404,
                error: {
                    message: error.response.data.message,
                    type: error.response.data.type,
                },
            });
        } else if (error.response?.status === 422) {
            return res.status(422).json({
                message: error.response.data.message,
                status: 422,
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
                    type: 'server-error',
                },
            });
        }
    }
};

export const createBulk = async (req: Request, res: Response) => {
    try {
        const newProducts: ProductType[] = {
            ...req.body,
        };

        const createdProducts = await createBulkProducts(newProducts);
        return res.status(201).json({ message: 'Products successfully created', data: createdProducts, status: 201 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'server-error',
            },
        });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    const { page, size, search, sort } = req.query;

    const _page = parseInt(page as string);
    const _size = parseInt(size as string);

    try {
        const { results, totalItems, totalPages, limit } = await getAllProducts(
            search as string,
            _page,
            _size,
            sort as string,
        );

        return res.status(200).json({
            message: 'OK',
            data: results,
            status: 200,
            meta: {
                count: totalItems,
                load: results.length,
                page: totalPages,
                offset: limit,
            },
        });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'server-error',
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
                message: `Product with id ${productId} not found`,
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'not-found',
                },
            });
        }

        const category = await getCategoryById(product.categoryId);
        const images = await getImageByProductId(productId);
        product.setDataValue('categoryName', category.data.data.name);
        product.setDataValue('images', images.data.data);

        return res.status(200).json({ message: 'OK', data: product, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        if (error.response?.status === 404) {
            return res.status(404).json({
                message: error.response.data.message,
                status: 404,
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
                    type: 'server-error',
                },
            });
        }
    }
};

export const update = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const token = req.headers.authorization;
    try {
        await checkAuth(token);
        const product = await getProductbyId(productId);

        if (!product) {
            return res.status(404).json({
                message: `Product with id ${productId} not found`,
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'not-found',
                },
            });
        }

        const productData: ProductType = {
            ...req.body,
        };

        await deleteImageByProductId(productId, token);
        await updateProductById(productData, productId);
        const images = await uploadProductImage(req.files, productId, token);
        const updatedProduct = await getProductbyId(productId);

        if (!updatedProduct) {
            return res.status(404).json({
                message: `Product with id ${productId} not found`,
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'not-found',
                },
            });
        }

        const category = await getCategoryById(productData.categoryId);
        updatedProduct.setDataValue('images', images.data.data);
        updatedProduct.setDataValue('categoryName', category.data.data.name);

        return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct, status: 200 });
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
        } else if (error.response?.status === 404) {
            return res.status(404).json({
                message: error.response.data.message,
                status: 404,
                error: {
                    message: error.response.data.message,
                    type: error.response.data.type,
                },
            });
        } else if (error.response?.status === 422) {
            return res.status(422).json({
                message: error.response.data.message,
                status: 422,
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
                    type: 'server-error',
                },
            });
        }
    }
};

export const remove = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const token = req.headers.authorization;

    try {
        await checkAuth(token);
        const product = await getProductbyId(productId);

        if (!product) {
            return res.status(404).json({
                message: `Product with id ${productId} not found`,
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'not-found',
                },
            });
        }

        await deleteProductById(productId);
        await deleteImageByProductId(productId, token);
        return res.status(200).json({ message: 'Product Removed Successfully', data: product, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'server-error',
            },
        });
    }
};
