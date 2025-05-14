import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/user.utils";
import { IToken, TokenDocument } from "../interfaces/interface";
import { tokenService, userService } from "../services/user.service";
import mongoose from "mongoose";
import TokenModel from "../models/token";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { IUser } from "../interfaces/model.interfaces";
import { PaginationOptions } from "../interfaces/common.interfaces";

export const validateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user : IUser | null = await userService.findUserByEmail(email, password);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const accessToken = tokenService.generateAccessToken(user);
    const accessTokenExpiry = new Date(Date.now() + (parseInt(process.env.ACCESS_TOKEN_EXPIRY_MS || '30000000'))); // Default 5 minutes in ms

    const refreshToken = tokenService.generateRefreshToken(user);
    const refreshTokenExpiry = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS || '86400000'))); // Default 24 hours in ms

    // Check if an active token exists for this user
    let existingToken : IToken | null = await tokenService.findTokenByUserId(user._id);

    if (existingToken) {
      // Check if the existing access token is expired
      if (existingToken.accessTokenExpiry.getTime() > Date.now()) {
        res.status(200).json(successResponse(existingToken,"Existing token fetched Successfully")); // Return the existing valid token
        return;
      } else {
        // Delete the expired token
        await tokenService.deleteToken(existingToken?._id);
        existingToken = null; // Set to null so a new token is created below
      }
    }

    let newToken: IToken;
    if (!existingToken) {
      newToken = await tokenService.createToken(
        user._id,
        accessToken,
        refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry
      );
    } else {
      // This case should ideally not be reached if the expiry check is correct,
      // but it's here for robustness. Update the existing token if needed.
      newToken = await tokenService.updateToken(
        existingToken, // Use existingToken._id
        accessToken,
        accessTokenExpiry
      );
    }

    res.status(200).json(successResponse(newToken, "Access token genrated Successfully"));
  } catch (error: any) {
    console.error('Error validating user in controller:', error);
    res.status(500).json(errorResponse('Error validating user',error));
  }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        //  Use the type of your request object.
        const userId = req.body.userId; // You might need to adjust how you get this data
        const user : IUser | null = await userService.getUserById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found for this refresh token' });
            return;
        }

        const newAccessToken = tokenService.generateAccessToken(user);
        const newAccessTokenExpiry = new Date(Date.now() + (parseInt(process.env.ACCESS_TOKEN_EXPIRY_MS || '300000'))); // Default 5 minutes in ms

        // Assuming req.refreshTokenData holds the identifier for the token to update
        await tokenService.updateToken((req as any).refreshTokenData, newAccessToken, newAccessTokenExpiry);
        const data = { accessToken: newAccessToken, expiresIn: Math.floor((newAccessTokenExpiry.getTime() - Date.now()) / 1000) }
        res.status(200).json(successResponse(data,"Token Refreshed Successfully"));

    } catch (error: any) {
        console.error('Error refreshing token in controller:', error);
        res.status(500).json(errorResponse('Error refreshing token',error));
    }
}

export const createUserController = async (req: Request, res : Response) : Promise<void> => {
    try{
            const newSavedUser : IUser | null = await userService.createUser(req.body);
            res.status(201).json(successResponse(newSavedUser, "User Created successfully"));
        }
        catch (error) {
                res.status(500).json(errorResponse('Failed to submit enrollment', error));
            }
}

export const getUserById = async (req: Request, res : Response) : Promise<void> => {
    try{
            const user : IUser[] | null = await userService.getUserByID(req.params.id as unknown as mongoose.Schema.Types.ObjectId);
            
            res.status(201).json(successResponse(user, "User fetched successfully"));
        }
        catch (error) {
                res.status(500).json(errorResponse('Failed to fetch User', error));
            }
}

export const getUserByRole = async (req: Request, res : Response) : Promise<void> => {
    try{
      const pageOptions: PaginationOptions = {
              page: parseInt(req.query.page as string),
              limit: parseInt(req.query.limit as string),
            };
            const user= await userService.getUserByRole(pageOptions,req?.query?.role as string);
            
            res.status(201).json(successResponse(user, "User fetched successfully"));
        }
        catch (error) {
                res.status(500).json(errorResponse('Failed to fetch User', error));
            }
}

export const deleteTokenController=async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void>=>{
    try{
        const token : TokenDocument[] = await TokenModel.find({userId : req?.params.id})
        const trialDetails = await tokenService.deleteToken(token?.[0]?._id);
        res.status(200).json(successResponse(trialDetails, "User Logged Out successfully"));
    }
  catch (error) {
    res.status(500).json(errorResponse('Failed to delete trial', error));
}
}

