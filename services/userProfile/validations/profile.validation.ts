import Joi from 'joi';

const user = {
    profile: Joi.object().keys({
        uid: Joi.string().trim().messages({
            'string.base': `uid must be a type of string`,
            'string.empty': `uid cannot be an empty field`,
            'any.required': `uid is a required field`,
        }),
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
