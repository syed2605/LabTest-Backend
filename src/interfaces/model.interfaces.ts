import mongoose, { Document } from 'mongoose';
import { ITimeStamps, ICreatedUpdatedBy } from './common.interfaces';

export enum UserRole {
    patient = 'patient',
    Admin = 'admin',
    Head = 'head',
    SampleCollector = 'sampleCollector'
}

export interface IUser extends Document, ITimeStamps, ICreatedUpdatedBy {
  _id:mongoose.Schema.Types.ObjectId;
  name: string;
  role: UserRole;
  email: string;
  password: string;
  age: number;
  gender: string;
  phoneNumber : number;
  departmentId: mongoose.Schema.Types.ObjectId;
  processId: mongoose.Schema.Types.ObjectId;
}

export interface IToken extends Document, ITimeStamps, ICreatedUpdatedBy {
  user_id: mongoose.Schema.Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: Date;
  refreshTokenExpiry: Date;
}
