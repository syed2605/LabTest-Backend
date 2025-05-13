import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/user.utils';

interface User {
    userId: string;
    iat: number;
    exp:number
}
export interface AuthenticatedRequest extends Request {
    user?: User;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (token == null) {
        return res.status(401).json(errorResponse("User Unauthorized")); // Unauthorized - No token
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY || 'access-token-key', (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json(errorResponse("token expired",err)); // Unauthorized - Invalid token
        }
        req.user = user as User; // Attach user information to the request
        next(); // Proceed to the next middleware or route handler
    });
};

export default authenticateToken;
