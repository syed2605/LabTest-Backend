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

export interface ISample extends Document, ITimeStamps, ICreatedUpdatedBy {
  patientId: mongoose.Schema.Types.ObjectId;
  departmentId: mongoose.Schema.Types.ObjectId;
  collectionDate?: Date;
  physicianName: string;
  tissueType: string;
  processIds: mongoose.Schema.Types.ObjectId[];
  currentProcessId: mongoose.Schema.Types.ObjectId;
  status: SampleStatus;
  isRejected:Boolean;
  rejectedProcessIds: mongoose.Schema.Types.ObjectId[];
}


export interface IDepartment extends Document, ITimeStamps, ICreatedUpdatedBy {
  title: string;
  description: string;
}

export interface IProcess extends Document, ITimeStamps, ICreatedUpdatedBy {
  title: string;
  description: string;
  departmentId: mongoose.Schema.Types.ObjectId;
  sequence: number;
  validRange: string;
}

export interface IResult extends Document, ITimeStamps, ICreatedUpdatedBy {
  sampleId: mongoose.Schema.Types.ObjectId;
  departmentId: mongoose.Schema.Types.ObjectId;
  processId: mongoose.Schema.Types.ObjectId;
  resultSummary: string;
}

export interface IInstrument extends Document, ITimeStamps, ICreatedUpdatedBy {
  name: string;
}

export interface IInstrumentResult extends Document, ITimeStamps, ICreatedUpdatedBy {
  sampleId: mongoose.Schema.Types.ObjectId;
  departmentId: mongoose.Schema.Types.ObjectId;
  processId: mongoose.Schema.Types.ObjectId;
  resultSummary: string;
  inValidRange: boolean;
}

