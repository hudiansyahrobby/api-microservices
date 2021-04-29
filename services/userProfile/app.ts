import express, { Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { config as dotenv } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import initDB from './helpers/initDB';

// Routes
import profileRoute from './routes/profile.route';
import firebaseInit from './helpers/firebase/firebaseInit';

dotenv();

const app: Application = express();

firebaseInit();
initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const origin: string = process.env.NODE_ENV !== 'production' ? '*' : (process.env.CLIENT_URL as string);

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
                url: 'http://localhost:8082/api/v1',
            },
        ],
    },
    apis: ['./docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', profileRoute);

export default app;
