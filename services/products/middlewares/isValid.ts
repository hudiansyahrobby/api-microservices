import AppError from '../errorHandler/AppError';

const isValid = (schema: any, property: any) => {
    return (req: any, res: any, next: any) => {
        const { error } = schema.validate(req[property]);
        const valid = error == null;
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map((i: any) => i.message).join(',');
            return next(new AppError(message, 422, 'validation-error'));
        }
    };
};

export default isValid;
