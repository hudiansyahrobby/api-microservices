import { logger } from '../helpers/logger';

const isValid = (schema: any, property: any) => {
    return (req: any, res: any, next: any) => {
        const { error } = schema.validate(req[property]);
        const valid = error == null;
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map((i: any) => i.message).join(',');
            logger.log({
                level: 'info',
                message: message,
            });
            res.status(422).json({
                message: message,
            });
        }
    };
};

export default isValid;
