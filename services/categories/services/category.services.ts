import Category from '../models/category.model';
import CategoryType from '../interfaces/Category';
import { Op } from 'sequelize';

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
    console.log(updatedCategory);
    console.log(id);
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
