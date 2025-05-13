import mongoose, { Schema } from 'mongoose';
import { IUser, UserRole } from '../interfaces/model.interfaces';

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(UserRole) },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  departmentId: { type: mongoose.Types.ObjectId, required: false },
  processId: { type: mongoose.Types.ObjectId, required: false },
  createdBy: { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
  updatedBy: { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
