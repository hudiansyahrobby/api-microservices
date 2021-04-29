import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import initDB from './helpers/initDB';
import { config } from 'dotenv';

// ROUTES
import categoryRoute from './routes/category.route';

config();
const app = express();

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

app.use('/api/v1', categoryRoute);

// Swagger Documentatios

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'APIKOM API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:8085/api/v1',
            },
        ],
    },
    apis: ['./docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
