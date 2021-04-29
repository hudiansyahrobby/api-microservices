import Image from '../models/image.model';

export const findImageById = (id: string) => {
    return Image.findByPk(id);
};

export const findImageByProductId = (productId: string) => {
    return Image.findAll({ where: { productId } });
};

export const destroyImageByProductId = (productId: string) => {
    return Image.destroy({ where: { productId } });
};

export const removeImageOnDB = (id: string) => {
    return Image.destroy({
        where: {
            id,
        },
    });
};
