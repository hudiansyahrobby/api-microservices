import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { logger } from '../helpers/logger';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    // Token Format 'Bearer token'

    const token = req.headers?.authorization?.split(' ')[1];
    if (token) {
        admin
            .auth()
            .verifyIdToken(token)
            .then(() => {
                next();
            })
            .catch((err) => {
                logger.log({ level: 'info', message: err });
                res.status(403).json({ message: 'Unauthorized' });
            });
    } else {
        logger.log({ level: 'info', message: "Token doesn't exist or bad formatted" });
        res.status(403).json({ message: "Token doesn't exist or bad formatted" });
    }
}
