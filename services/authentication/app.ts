import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { config as dotenv } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import initDB from './helpers/initDB';
import firebaseInit from './helpers/firebase/firebaseInit';
import AppError from './errorHandler/AppError';
import { sendErrorDev, sendErrorProd } from './errorHandler/errorResponse';
import { logger } from './helpers/logger';

// Routes
import authRoute from './routes/auth.route';

dotenv();

const app: Application = express();
initDB();
firebaseInit();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(compression());

app.use(helmet());

// API DOCUMENTATION

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Microservices API',
            description: 'API for Microservices',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:8080/api/v1',
            },
        ],
    },
    apis: ['./docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/auth/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', authRoute);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'not-found'));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
        if (err?.response) {
            logger.log({ level: 'error', message: err.response.data.message });
            sendErrorDev(err.response.data, res);
        } else {
            console.log(err);
            logger.log({ level: 'error', message: err.message });
            err.status = err.status || 500;
            sendErrorDev(err, res);
        }
    } else if (process.env.NODE_ENV === 'production') {
        if (err?.response) {
            logger.log({ level: 'error', message: err.response.data.message });
            sendErrorProd(err.response.data, res);
        } else {
            logger.log({ level: 'error', message: err.message });
            err.status = err.status || 500;
            sendErrorProd(err, res);
        }
    }
});

process.on('unhandledRejection', (err: any) => {
    logger.log({
        level: 'error',
        message: `${err.name} - ${err.message}`,
    });
    logger.log({
        level: 'info',
        message: 'UNHANDLED REJECTION! 💥 Shutting down...',
    });
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.log({
        level: 'error',
        message: `${err.name} - ${err.message}`,
    });
    logger.log({
        level: 'info',
        message: 'UNHANDLED REJECTION! 💥 Shutting down...',
    });

    process.exit(1);
});

export default app;
