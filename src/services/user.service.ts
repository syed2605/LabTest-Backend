import { SignOptions } from "jsonwebtoken";
import { IToken, TokenService, UserDocument, UserService } from "../interfaces/interface";
import TokenModel from "../models/token";
import jwt from 'jsonwebtoken';
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import { IUser } from "../interfaces/model.interfaces";
import { PaginationOptions } from "../interfaces/common.interfaces";

// Inject your services (using a DI container or manual instantiation)
export const userService: UserService = {
    findUserByEmail: async (email: string, password: string): Promise<IUser | null> => {
        try {
            const user = await UserModel.findOne({ email, password }).exec();
            return user;
        } catch (error) {
        console.error('Error finding user by email in service:', error);
        throw { status: 500, message: 'Error finding user' };
        }
       },
    getUserById: async (id: mongoose.Schema.Types.ObjectId): Promise<IUser | null> => {
        try {
        // if (!Types.ObjectId.isValid(id)) {
        // throw { status: 400, message: 'Invalid User ID format' };
        // }
        const user = await UserModel.findById({ _id: id }).exec();
        if (!user) {
        throw { status: 404, message: 'User not found' };
        }
        return user;
        } catch (error :any) {
        console.error('Error fetching user by ID in service:', error);
        if (error.status) {
        throw error;
        } else if (error instanceof Error && error.name === 'CastError') {
        throw { status: 400, message: 'Invalid User ID format' };
        }
        throw { status: 500, message: 'Error fetching user by ID' };
        }
       },
       createUser: async (user : IUser) :  Promise<IUser | null> => {
        try {
            const userCreated = new UserModel(user);
            return await userCreated.save();
        } catch (error: any) {
            console.error('Error creating User in service:', error);
            if (error.status) {
                throw error;
            }
            throw { status: 500, message: 'Error creating User' };
        }
       },
       getUserByID: async (_id : mongoose.Schema.Types.ObjectId) :  Promise<IUser[] | null> => {
        try {
            const user= await UserModel.find({_id }).select("-password");
            return user;
        } catch (error: any) {
            console.error('Error getting enroll in service:', error);
            if (error.status) {
                throw error;
            }
            throw { status: 500, message: 'Error getting enroll' };
        }
       },
       getUserByRole: async (pageOptions: PaginationOptions,role : string) :  Promise<{
         user: IUser[];
         totalCount: number;
         totalPages: number;
         currentPage: number;
       }> => {
         const { page = 1, limit = 10 } = pageOptions;
          const skip = (page - 1) * limit;
          try {
            const users = UserModel.find({role}).select("-password").skip(skip).limit(limit).exec();
            const countPromise = UserModel.countDocuments().exec();
        
            const [user, totalCount] = await Promise.all([users, countPromise]);
        
            const totalPages = Math.ceil(totalCount / limit);
            const currentPage = page;
        
            return {
              user,
              totalCount,
              totalPages,
              currentPage,
            };
        } catch (error: any) {
            console.error('Error getting users for this role in service:', error);
            if (error.status) {
                throw error;
            }
            throw { status: 500, message: 'Error getting enroll' };
        }
       }
}; // Replace with your actual userService instance


    
export const tokenService: TokenService = {
    generateAccessToken: (user: IUser): string => {
        const payload = { userId: user._id };
        const secret = process.env.JWT_SECRET_KEY || 'access-token-key';
        const options: SignOptions = {
          expiresIn:'25m',
        };
        return jwt.sign(payload, secret, options);
      },
    generateRefreshToken: (user: IUser): string => {
        const payload = { userId: user._id };
        const secret = process.env.JWT_SECRET_KEY || 'refresh-token-key';
        const options: SignOptions = {
          expiresIn: '50m',
        };
        return jwt.sign(payload, secret, options);
      },
    findTokenByUserId: async (userId: mongoose.Schema.Types.ObjectId): Promise<IToken | null> => {
        try {
            return await TokenModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
        } catch (error) {
        console.error('Error finding token by user ID:', error);
        throw error;
        }
       },
    createToken: async (
        userId: mongoose.Schema.Types.ObjectId,
        accessToken: string,
        refreshToken: string,
        accessTokenExpiry: Date,
        refreshTokenExpiry: Date
       ): Promise<IToken> => {
        try {
        const newToken = new TokenModel({
        userId,
        accessToken,
        refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry,
        });
        return await newToken.save();
        } catch (error) {
        console.error('Error creating token in service:', error);
        throw { status: 500, message: 'Error saving token' };
        }
       },
    updateToken: async (
        tokenDocument: IToken,
        newAccessToken: string,
        newAccessTokenExpiry: Date
       ): Promise<IToken> => {
       try {
        tokenDocument.accessToken = newAccessToken;
        tokenDocument.accessTokenExpiry = newAccessTokenExpiry;
        return await tokenDocument.save();
        } catch (error) {
        console.error('Error updating token in service:', error);
        throw { status: 500, message: 'Error updating token' };
        }
       },
    deleteToken: async (tokenId: mongoose.Schema.Types.ObjectId): Promise<IToken | null> => {
        try {
        const result = await TokenModel.findByIdAndDelete(tokenId).exec();
        return result; // Returns the deleted document or null if not found
        } catch (error) {
        console.error('Error deleting token:', error);
        throw error;
        }
       }
};  