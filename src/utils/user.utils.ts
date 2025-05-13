import { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export interface ApiResponse<T>  {
    status : 'success' | "error";
    message : string;
    data? : T;
    error?: any;
}

export const successResponse = <T>(data: T , message= 'success'): ApiResponse<T> => ({
    status: 'success',
    message,
    data,
})

export const errorResponse = <T>(message = 'something went wrong',error: any =null): ApiResponse<T> => ({
    status: "error",
    message,
    error
})

interface User {
    _id: string; // Assuming your User object has an _id property of type string
  }
  
  export const generateAccessToken = (user: User): string => {
    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET_KEY || 'access-token-key';
    const options: SignOptions = {
      expiresIn:'25m',
    };
    return jwt.sign(payload, secret, options);
  };
  
  export const generateRefreshToken = (user: User): string => {
    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET_KEY || 'refresh-token-key';
    const options: SignOptions = {
      expiresIn: '50m',
    };
    return jwt.sign(payload, secret, options);
  };
