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
    try {
        const newProduct: ProductType = {
            ...req.body,
        };
        const category = await getCategoryById(categoryId);
        const product = await createProduct(newProduct);
        const images = await uploadProductImage(req.files, product.id);

        product.setDataValue('images', images.data.data);
        product.setDataValue('categoryName', category.data.data.name);

        return res.status(201).json({
            message: 'Product successfully created',
            data: { product: product },
            status: 201,
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

        const category = await getCategoryById(product.categoryId);
        const images = await getImageByProductId(productId);
        product.setDataValue('categoryName', category.data.data.name);
        product.setDataValue('images', images.data.data);

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

export const update = async (req: Request, res: Response) => {
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

        // DELETE IMAGES
        await deleteImageByProductId(productId);
        await updateProductById(productData, productId);
        const images = await uploadProductImage(req.files, productId);
        const updatedProduct = await getProductbyId(productId);

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `Product with id ${productId} not found`,
                    type: 'Not Found',
                },
            });
        }

        const category = await getCategoryById(productData.categoryId);
        updatedProduct.setDataValue('images', images.data.data);
        updatedProduct.setDataValue('categoryName', category.data.data.name);

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
        await deleteImageByProductId(productId);
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
