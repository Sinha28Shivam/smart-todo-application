export class AppError extends Error {
    constructor(message, statuscode){
        super(message);
        this.statuscode = statuscode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError{
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class BadRequestError extends AppError{
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}