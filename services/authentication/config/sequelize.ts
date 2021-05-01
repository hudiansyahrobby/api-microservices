import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { config } from 'dotenv';

config();

let sequelizeConfig;

if (process.env.NODE_ENV === 'development') {
    sequelizeConfig = {
        database: process.env.POSTGRES_DATABASE_DEV,
        username: process.env.POSTGRES_USERNAME_DEV,
        password: process.env.POSTGRES_PASSWORD_DEV,
    };
} else if (process.env.NODE_ENV === 'test') {
    sequelizeConfig = {
        database: process.env.POSTGRES_DATABASE_TEST,
        username: process.env.POSTGRES_USERNAME_TEST,
        password: process.env.POSTGRES_PASSWORD_TEST,
        logging: false,
    };
} else if (process.env.NODE_ENV === 'production') {
    sequelizeConfig = {
        database: process.env.POSTGRES_DATABASE_PROD,
        username: process.env.POSTGRES_USERNAME_PROD,
        password: process.env.POSTGRES_PASSWORD_PROD,
        logging: false,
    };
}

const sequelize = new Sequelize({
    ...sequelizeConfig,
    dialect: 'postgres',
    port: 5432,
    host: 'users_db',
    models: [path.join(__dirname, '..', 'models', '**')],
    // query: {
    //     raw: true,
    // },
});

export default sequelize;
