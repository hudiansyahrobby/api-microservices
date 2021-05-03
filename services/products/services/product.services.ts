import Product from '../models/product.model';
import { ProductType } from '../types/ProductType';
import { Op } from 'sequelize';
import { getPagination } from '../helpers/getPagination';
import { getSort } from '../helpers/getSort';
import { getPaginationData } from '../helpers/getPaginationData';
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import AppError from '../errorHandler/AppError';

config();

export const getProductbyId = async (productId: string) => {
    const product = await Product.findOne({
        where: { id: productId },
    });

    if (!product) {
        throw new AppError(`Product with id ${productId} not found`, 404, 'not-found');
    }

    const category = await getCategoryById(product.categoryId);

    if (!category) {
        throw new AppError(`Category with id ${product.categoryId} not found`, 404, 'not-found');
    }

    const images = await getImageByProductId(productId);
    product.setDataValue('categoryName', category.data.data.name);
    product.setDataValue('images', images.data.data);

    return product;
};

export const createProduct = async (
    newProduct: ProductType,
    images:
        | {
              [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[],
    token: string | undefined,
) => {
    const { categoryId } = newProduct;

    await checkAuth(token);
    const category = await getCategoryById(categoryId);

    if (!category) {
        throw new AppError(`Category with id ${categoryId} not found`, 404, 'not-found');
    }

    const product = await Product.create(newProduct);

    const _images = await uploadProductImage(images, product.id, token);

    product.setDataValue('images', _images.data.data);
    product.setDataValue('categoryName', category.data.data.name);
    console.log(product);
    return product;
};

export const createBulkProducts = (newProducts: ProductType[]) => {
    return Product.bulkCreate(newProducts, { returning: true });
};

export const getAllProducts = async (search: string, page: number, size: number, sort: string) => {
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

    const { limit, offset } = getPagination(page, size);

    const orderBy = !!sort ? getSort(sort) : ['createdAt', 'DESC'];

    const products = await Product.findAndCountAll({
        where: searchCondition,
        limit,
        offset,
        order: [orderBy as any],
        raw: true,
    });

    const allCategories: Promise<AxiosResponse<any>>[] = [];
    const allImages: Promise<AxiosResponse<any>>[] = [];

    products.rows.map((product) => {
        allCategories.push(getCategoryById(product.categoryId));
        allImages.push(getImageByProductId(product.id));
    });

    const allCategoryPromises = Promise.all(allCategories);
    const categories = await allCategoryPromises;

    const allImagePromises = Promise.all(allImages);
    const images = await allImagePromises;

    type imageObj = {
        id: string;
        imageId: string;
        imageUrl: string;
        productId: string;
    };

    type ProductType = Product & {
        categoryName?: string;
        images?: imageObj[];
    };

    const allProducts = products.rows.map((product, index) => {
        let _product: ProductType = product;
        _product.categoryName = categories[index].data.data.name;
        _product.images = images[index].data.data;
        return _product;
    });

    products.rows = allProducts;
    const _products = getPaginationData(products, page, limit);

    return _products;
};

export const getProductByCategory = (categoryId: string, limit: number, offset: number, orderBy: any) => {
    return Product.findAndCountAll({
        limit,
        offset,
        order: [orderBy as any],
    });
};

export const updateProductById = async (
    updatedProduct: ProductType,
    images:
        | {
              [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[],
    productId: string,
    token: string | undefined,
) => {
    await checkAuth(token);

    const product = await getProductbyId(productId);

    if (!product) {
        throw new AppError(`Product with id ${productId} not found`, 404, 'not-found');
    }

    await deleteImageByProductId(productId, token);
    const [_, _updatedProduct] = await Product.update(updatedProduct, {
        where: { id: productId },
        returning: true,
    });

    const _images = await uploadProductImage(images, productId, token);
    const category = await getCategoryById(_updatedProduct[0].categoryId);

    _updatedProduct[0].setDataValue('images', _images.data.data);
    _updatedProduct[0].setDataValue('categoryName', category.data.data.name);

    return _updatedProduct[0];
};

export const deleteProductById = async (productId: string, token: string | undefined) => {
    await checkAuth(token);

    const product = await getProductbyId(productId);

    if (!product) {
        throw new AppError(`Product with id ${productId} not found`, 404, 'not-found');
    }

    await Product.destroy({
        where: { id: productId },
    });

    await deleteImageByProductId(productId, token);

    return product;
};

export const uploadProductImage = (
    images:
        | {
              [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[],
    productId: string,
    token: string | undefined,
) => {
    let headersConfig = {};

    if (token) {
        headersConfig = {
            authorization: token,
        };
    }

    const form = new FormData();
    form.append('product_id', productId);
    form.append('images', fs.createReadStream(path.join(__dirname, '..', 'public', 'carbon.png')));
    const headers = {
        ...form.getHeaders(),
        ...headersConfig,
    };

    return axios.post('http://images:8084/api/v1/images', form, { headers });
};

export const getImageByProductId = (productId: string) => {
    return axios.get(`http://images:8084/api/v1/images/products/${productId}`);
};

export const deleteImageById = (imageId: string) => {
    return axios.get(`http://images:8084/api/v1/images/${imageId}`);
};

export const deleteImageByProductId = (productId: string, token: string | undefined) => {
    let headersConfig = {};

    if (token) {
        headersConfig = {
            authorization: token,
        };
    }
    return axios.delete(`http://images:8084/api/v1/images/products/${productId}`, {
        headers: headersConfig,
    });
};

export const getCategoryById = (categoryId: string) => {
    return axios.get(`http://categories:8085/api/v1/categories/${categoryId}`);
};

export const checkAuth = async (token: string | undefined) => {
    let headersConfig = {};

    if (token) {
        headersConfig = {
            authorization: token,
        };
    }
    const response = await axios.post(
        `http://authentication:8081/api/v1/auth/check-auth`,
        {},
        {
            headers: headersConfig,
        },
    );
    const uid = response.data.data.uid;
    return uid;
};
