import Category from '../models/category.model';
import CategoryType from '../interfaces/Category';
import { Op } from 'sequelize';
import axios from 'axios';

export const createCategory = (name: string) => {
    return Category.findOrCreate({
        where: {
            name: {
                [Op.iLike]: name,
            },
        },
        defaults: {
            name,
        },
    });
};

export const findCategoryById = (id: string) => {
    return Category.findOne({
        where: {
            id,
        },
    });
};

export const findAllCategories = () => {
    return Category.findAll();
};

export const updateCategoryById = (updatedCategory: CategoryType, id: string) => {
    return Category.update(updatedCategory, {
        where: {
            id,
        },
        returning: true,
    });
};

export const deleteCategoryById = (id: string) => {
    return Category.destroy({
        where: {
            id,
        },
    });
};

export const getCategoryById = (id: string) => {
    return id;
};

export const checkAuth = async (token: string | undefined) => {
    let headersConfig = {};

    if (token) {
        headersConfig = {
            authorization: token,
        };
    }
    const response = await axios.post(
        `http://172.25.0.5:8081/api/v1/auth/check-auth`,
        {},
        {
            headers: headersConfig,
        },
    );
    const uid = response.data.data.uid;
    return uid;
};
