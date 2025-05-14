import mongoose, { Schema } from 'mongoose';
import { IDepartment, Status } from '../interfaces/model.interfaces';

const DepartmentSchema = new Schema<IDepartment>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(Status) },
}, { timestamps: true });

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
