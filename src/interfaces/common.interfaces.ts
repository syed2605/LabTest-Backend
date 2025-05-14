import mongoose from 'mongoose';

export interface ITimeStamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreatedUpdatedBy {
  createdBy?: mongoose.Schema.Types.ObjectId;
  updatedBy?: mongoose.Schema.Types.ObjectId;
}
export interface EmailOptions { 
  to: string | string[]; 
  subject: string; 
  html?: string; 
  text?: string; 
} 

export interface INotifi{
  user_id: mongoose.Schema.Types.ObjectId | undefined;
  type: string;
  message: string;
  isRead: boolean;
}