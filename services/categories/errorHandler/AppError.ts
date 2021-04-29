export default class AppError extends Error {
    private statusCode;
    private type;
    private isOperational;

    constructor(message: string, statusCode: number, type: string) {
        super(message);

        this.statusCode = statusCode;
        this.type = type;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
