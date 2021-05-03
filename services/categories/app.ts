import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import initDB from './helpers/initDB';
import { config } from 'dotenv';
import AppError from './errorHandler/AppError';
import { sendErrorDev, sendErrorProd } from './errorHandler/errorResponse';

// ROUTES
import categoryRoute from './routes/category.route';
import { logger } from './helpers/logger';

config();
const app: Application = express();

initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);

app.use(compression());

app.use(helmet());

// Swagger Documentatios

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

// TODO DB ERROR HANDLER

app.use('/categories/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', categoryRoute);

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
