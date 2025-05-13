import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  { IToken } from '../interfaces/interface';
import TokenModel from '../models/token';
import { errorResponse } from '../utils/user.utils';


interface AuthenticatedRequest extends Request {
    refreshTokenData?: IToken;
}

const validateRefreshToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (refreshToken == null) {
        return res.sendStatus(401); // Unauthorized - No token
    }

    try {
        const refreshTokenData = await TokenModel.findOne({ refreshToken }).exec();

        if (!refreshTokenData) {
            return res.status(401).json(errorResponse('Unauthorized - refresh token not found.'));
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY || 'refresh-token-key', async (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                const { _id } = refreshTokenData;
                await TokenModel.findByIdAndDelete(_id);
                return res.status(401).json(errorResponse('Unauthorized - refresh token is expired. Please Login again.',err));
            }
            req.refreshTokenData = refreshTokenData; // Attach user information to the request
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        console.error('Error validating refresh token:', error);
        return res.status(500).json(errorResponse('Internal Server Error',error));
    }
};

export default validateRefreshToken;
