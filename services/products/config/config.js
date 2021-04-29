const { config } = require('dotenv');
config();

const env = process.env;

module.exports = {
    development: {
        username: env.POSTGRES_USERNAME_DEV,
        password: env.POSTGRES_PASSWORD_DEV,
        database: env.POSTGRES_DATABASE_DEV,
        host: 'products_db',
        port: 5432,
        dialect: 'postgres',
    },
    test: {
        username: env.POSTGRES_USERNAME_TEST,
        password: env.POSTGRES_PASSWORD_TEST,
        database: env.POSTGRES_DATABASE_TEST,
        host: 'products_db',
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: env.POSTGRES_USERNAME_PROD,
        password: env.POSTGRES_PASSWORD_PROD,
        database: env.POSTGRES_DATABASE_PROD,
        host: 'products_db',
        dialect: 'postgres',
        logging: false,
    },
};
