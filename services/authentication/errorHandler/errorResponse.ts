import { Response } from 'express';
import { logger } from '../helpers/logger';

export const sendErrorDev = (err: any, res: Response) => {
    res.status(err.status).json({
        message: err.message,
        status: err.status,
        error: {
            message: err.message,
            type: err.type,
        },
        stack: err.stack,
    });
};

export const sendErrorProd = (err: any, res: Response) => {
    if (err.isOperational) {
        res.status(err.status).json({
            message: err.message,
            status: err.status,
            error: {
                message: err.message,
                type: err.type,
            },
        });

        // Programming or other unknown error
    } else {
        // 1) Log error
        logger.log({ level: 'error', message: err });

        // 2) Send generic message
        res.status(500).json({
            message: 'Something went very wrong!',
            status: 500,
            error: {
                message: 'Something went very wrong!',
                type: 'server-error',
            },
        });
    }
};
