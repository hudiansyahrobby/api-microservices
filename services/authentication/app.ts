import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { config as dotenv } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Routes
import authRoute from './routes/auth.route';
import firebaseInit from './helpers/firebase/firebaseInit';
import AppError from './errorHandler/AppError';
import { sendErrorDev, sendErrorProd } from './errorHandler/errorResponse';
import { logger } from './helpers/logger';

dotenv();

const app: Application = express();

firebaseInit();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const origin = process.env.NODE_ENV !== 'production' ? '*' : process.env.CLIENT_URL;

app.use(
    cors({
        origin: origin,
        credentials: process.env.NODE_ENV === 'production',
    }),
);

app.use(compression());

app.use(helmet());

// API DOCUMENTATION

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'APIKOM App API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:8081/api/v1',
            },
        ],
    },
    apis: ['./docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', authRoute);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'not-found'));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
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
