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


export enum SampleStatus {
  IN_PROGRESS = 'Inprogress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
}

export interface ISample extends Document {
  patientId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  collectionDate: Date;
  physicianName: string;
  tissueType: string;
  processIds: mongoose.Types.ObjectId[];
  currentProcessId: mongoose.Types.ObjectId;
  status: SampleStatus;
}


export interface IDepartment extends Document {
  title: string;
  description: string;
}

export interface IProcess extends Document {
  title: string;
  description: string;
  departmentId: mongoose.Types.ObjectId;
  sequence: number;
  validRange: string;
}

export interface IResult extends Document {
  sampleId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  processId: mongoose.Types.ObjectId;
  resultSummary: string;
}


