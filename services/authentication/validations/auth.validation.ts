import Joi from 'joi';

const auth = {
    registerFirebase: Joi.object().keys({
        displayName: Joi.string()
            .pattern(/^[a-zA-Z ]*$/)
            .required()
            .messages({
                'string.base': `display name should be a type of string`,
                'string.empty': `display name cannot be an empty field`,
                'string.pattern.base': `display name should only contain alphapet or space`,
                'any.required': `display name is a required field`,
            }),
        email: Joi.string().email().required().messages({
            'string.base': `email should be a type of string`,
            'string.empty': `email cannot be an empty field`,
            'string.email': 'email is not valid',
            'any.required': `email is a required field`,
        }),
        phoneNumber: Joi.string().required().messages({
            'string.base': `Phone number should be a type of string`,
            'string.empty': `Phone number cannot be an empty field`,
            'any.required': `Phone number is a required field`,
        }),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/)
            .required()
            .messages({
                'string.base': `password should be a type of string`,
                'string.empty': `password cannot be an empty field`,
                'string.min': 'password must be at least 8 characters',
                'any.required': `password is a required field`,
                'string.pattern.base':
                    'password must be at least one uppercase letter, one lowercase letter, one number and one special character',
            }),
        passwordConfirmation: Joi.any().equal(Joi.ref('password')).required().messages({
            'any.only': `password does not match`,
            'any.required': `password confirmation is a required field`,
        }),
    }),

    loginFirebase: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.base': `email should be a type of string`,
            'string.empty': `email cannot be an empty field`,
            'string.email': `email is not valid`,
            'any.required': `email is a required field`,
        }),
        password: Joi.string().required().messages({
            'string.base': `password should be a type of string`,
            'string.empty': `password cannot be an empty field`,
            'any.required': `password is a required field`,
        }),
    }),

    registerUsername: Joi.object().keys({
        displayName: Joi.string()
            .pattern(/^[a-zA-Z ]*$/)
            .required()
            .messages({
                'string.base': `display name should be a type of string`,
                'string.empty': `display name cannot be an empty field`,
                'string.pattern.base': `display name should only contain alphapet or space`,
                'any.required': `display name is a required field`,
            }),
        username: Joi.string().alphanum().required().messages({
            'string.base': `username should be a type of string`,
            'string.empty': `username cannot be an empty field`,
            'string.alphanum': `username should only contain alphapet or number`,
            'any.required': `username is a required field`,
        }),
        phoneNumber: Joi.string().required().messages({
            'string.base': `Phone number should be a type of string`,
            'string.empty': `Phone number cannot be an empty field`,
            'any.required': `Phone number is a required field`,
        }),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/)
            .required()
            .messages({
                'string.base': `password should be a type of string`,
                'string.empty': `password cannot be an empty field`,
                'string.min': 'password must be at least 8 characters',
                'any.required': `password is a required field`,
                'string.pattern.base':
                    'password must be at least one uppercase letter, one lowercase letter, one number and one special character',
            }),
        passwordConfirmation: Joi.any().equal(Joi.ref('password')).required().messages({
            'any.only': `password does not match`,
            'any.required': `password confirmation is a required field`,
        }),
    }),

    loginUsername: Joi.object().keys({
        username: Joi.string().alphanum().required().messages({
            'string.base': `username should be a type of string`,
            'string.empty': `username cannot be an empty field`,
            'string.alphanum': `username should only contain alphapet or number`,
            'any.required': `username is a required field`,
        }),
        password: Joi.string().required().messages({
            'string.base': `password should be a type of string`,
            'string.empty': `password cannot be an empty field`,
            'any.required': `password is a required field`,
        }),
    }),
};

export default auth;
