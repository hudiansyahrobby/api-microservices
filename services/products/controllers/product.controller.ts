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
import { catchAsync } from '../errorHandler/catchAsync';
import AppError from '../errorHandler/AppError';

export const prepareImages = (req: Request, res: Response, next: NextFunction) => {
    uploadFiles(req, res, (err: any) => {
        next();
    });
};

export const create = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.body;
    const token = req.headers.authorization;
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
});

export const createBulk = catchAsync(async (req: Request, res: Response) => {
    const newProducts: ProductType[] = {
        ...req.body,
    };

    const createdProducts = await createBulkProducts(newProducts);
    return res.status(201).json({ message: 'Products successfully created', data: createdProducts, status: 201 });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
    const { page, size, search, sort } = req.query;

    const _page = parseInt(page as string);
    const _size = parseInt(size as string);

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
});

export const getDetail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const product = await getProductbyId(productId);

    if (!product) {
        return next(new AppError(`Product with id ${productId} not found`, 404, 'not-found'));
    }

    const category = await getCategoryById(product.categoryId);
    const images = await getImageByProductId(productId);
    product.setDataValue('categoryName', category.data.data.name);
    product.setDataValue('images', images.data.data);

    return res.status(200).json({ message: 'OK', data: product, status: 200 });
});

export const update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const token = req.headers.authorization;

    await checkAuth(token);
    const product = await getProductbyId(productId);

    if (!product) {
        return next(new AppError(`Product with id ${productId} not found`, 404, 'not-found'));
    }

    const productData: ProductType = {
        ...req.body,
    };

    await deleteImageByProductId(productId, token);
    await updateProductById(productData, productId);
    const images = await uploadProductImage(req.files, productId, token);
    const updatedProduct = await getProductbyId(productId);

    if (!updatedProduct) {
        return next(new AppError(`Product with id ${productId} not found`, 404, 'not-found'));
    }

    const category = await getCategoryById(productData.categoryId);
    updatedProduct.setDataValue('images', images.data.data);
    updatedProduct.setDataValue('categoryName', category.data.data.name);

    return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct, status: 200 });
});

export const remove = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const token = req.headers.authorization;

    await checkAuth(token);
    const product = await getProductbyId(productId);

    if (!product) {
        return next(new AppError(`Product with id ${productId} not found`, 404, 'not-found'));
    }

    await deleteProductById(productId);
    await deleteImageByProductId(productId, token);
    return res.status(200).json({ message: 'Product Removed Successfully', data: product, status: 200 });
});
