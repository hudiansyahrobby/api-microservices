export default interface Product {
    name: string;
    quantity: number;
    price: number;
    description: string;
    categoryId: string;
}

export type imageObj = {
    id: string;
    imageId: string;
    imageUrl: string;
    productId: string;
};

export type ProductType = Product & {
    categoryName?: string;
    images?: imageObj[];
};
