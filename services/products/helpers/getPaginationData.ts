import Product from '../types/ProductType';

interface ProductData {
    rows: Product[];
    count: number;
}

export const getPaginationData = (data: ProductData, page: number, limit: number) => {
    const { count: totalItems, rows: results } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, totalPages, results, currentPage, limit };
};
