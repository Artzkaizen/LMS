import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from './interfaces/ErrorResponse';

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
    err: Error,
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(
        token,
        process.env.LTI_PUBLIC_KEY || '',
        { audience: process.env.TOOL_CLIENT_ID },
        (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            // @ts-ignore
            req.user = user;
            next();
        }
    );
};
