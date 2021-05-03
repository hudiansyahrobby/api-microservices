import { NextFunction, Request, Response } from 'express';
import {
    createProduct,
    getAllProducts,
    getProductbyId,
    updateProductById,
    deleteProductById,
    createBulkProducts,
} from '../services/product.services';
import { ProductType } from '../types/ProductType';
import uploadFiles from '../helpers/initMulter';
import { catchAsync } from '../errorHandler/catchAsync';

export const prepareImages = (req: Request, res: Response, next: NextFunction) => {
    uploadFiles(req, res, (err: any) => {
        next();
    });
};

export const create = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const images = req.files;
    const newProduct: ProductType = {
        ...req.body,
    };

    const product = await createProduct(newProduct, images, token);

    return res.status(201).json({
        message: 'Product successfully created',
        data: product,
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

    return res.status(200).json({ message: 'OK', data: product, status: 200 });
});

export const update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const token = req.headers.authorization;
    const images = req.files;

    const productData: ProductType = {
        ...req.body,
    };

    const updatedProduct = await updateProductById(productData, images, productId, token);
    return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct, status: 200 });
});

export const remove = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const token = req.headers.authorization;

    const deletedProduct = await deleteProductById(productId, token);
    return res.status(200).json({ message: 'Product Removed Successfully', data: deletedProduct, status: 200 });
});
