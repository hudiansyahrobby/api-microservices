import Image from '../models/image.model';

export const findImageById = (id: string) => {
    return Image.findByPk(id);
};

export const removeImageOnDB = (id: string) => {
    return Image.destroy({
        where: {
            id,
        },
    });
};
