import Joi from 'joi';

const user = {
    profile: Joi.object().keys({
        address: Joi.string().messages({
            'string.base': `address should be a type of string`,
            'string.empty': `address cannot be an empty field`,
        }),
        about: Joi.string().min(50).max(1500).messages({
            'string.base': `about should be a type of string`,
            'string.empty': `about cannot be an empty field`,
            'string.max': 'about should be less than 1500 characters',
            'string.min': 'about should be more than 50 characters',
        }),
        job: Joi.string().messages({
            'string.base': `job should be a type of string`,
            'string.empty': `job cannot be an empty field`,
        }),
        birthday: Joi.date().iso(),
    }),
};

export default user;
