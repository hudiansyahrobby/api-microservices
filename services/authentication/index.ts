import app from './app';
import { logger } from './helpers/logger';

const PORT = process.env.PORT || 8081;

app.listen(PORT, () =>
    logger.log({
        level: 'info',
        message: `Listening on port: ${PORT}`,
    }),
);
