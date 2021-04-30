export default class AppError extends Error {
    private status;
    private type;
    private isOperational;

    constructor(message: string, status: number, type: string) {
        super(message);

        this.status = status;
        this.type = type;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
