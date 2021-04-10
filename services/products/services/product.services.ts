import Product from '../models/product.model';
import ProductType from '../interfaces/Product';

export const getProductbyId = (id: string) => {
    return Product.findOne({
        where: { id },
    });
};

export const createProduct = (newProduct: ProductType) => {
    return Product.create(newProduct);
};

export const createBulkProducts = (newProducts: ProductType[]) => {
    return Product.bulkCreate(newProducts, { returning: true });
};

export const getAllProducts = (searchCondition: any, limit: number, offset: number, orderBy: any) => {
    return Product.findAndCountAll({
        where: searchCondition,
        limit,
        offset,
        order: [orderBy as any],
    });
};

export const getProductByCategory = (categoryId: string, limit: number, offset: number, orderBy: any) => {
    return Product.findAndCountAll({
        limit,
        offset,
        order: [orderBy as any],
    });
};

export const updateProductById = (updatedProduct: ProductType, id: string) => {
    return Product.update(updatedProduct, {
        where: { id },
        returning: true,
    });
};

export const deleteProductById = (id: string) => {
    return Product.destroy({
        where: { id },
    });
};
