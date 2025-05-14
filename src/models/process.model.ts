import mongoose, { Schema } from 'mongoose';
import { IProcess, Status } from '../interfaces/model.interfaces';

const ProcessSchema = new Schema<IProcess>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
  sequence: { type: Number, required: true },
  validRange: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(Status) },
}, { timestamps: true });

export const Process = mongoose.model<IProcess>('Process', ProcessSchema);
