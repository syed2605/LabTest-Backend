import mongoose from 'mongoose';
import { SampleStatus } from './model.interfaces';

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

export interface AllSampleDataInterface {
  patientName?: string;
    departmentName?: string;
    collectionDate?: Date;
    physicianName?: string;
    tissueType?: string;
    processIds?: mongoose.Schema.Types.ObjectId[];
    currentProcessId?: string;
    status?: SampleStatus;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
  }