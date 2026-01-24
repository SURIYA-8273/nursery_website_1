export class AppError extends Error {
    constructor(
        public message: string,
        public code: string,
        public statusCode: number = 500,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network error occurred', originalError?: unknown) {
        super(message, 'NETWORK_ERROR', 503, originalError);
        this.name = 'NetworkError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public fields?: Record<string, string>) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}
