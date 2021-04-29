import Image from '../models/image.model';
import axios from 'axios';

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

export const checkAuth = async (token: string | undefined) => {
    let headersConfig = {};

    if (token) {
        headersConfig = {
            authorization: token,
        };
    }
    const response = await axios.post(
        `http://172.25.0.6:8081/api/v1/auth/check-auth`,
        {},
        {
            headers: headersConfig,
        },
    );
    const uid = response.data.data.uid;
    return uid;
};
