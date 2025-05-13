import mongoose, { Schema } from 'mongoose';
import { ISample, SampleStatus } from '../interfaces/model.interfaces';

const SampleSchema = new Schema<ISample>({
  patientId: { type: mongoose.Types.ObjectId, required: true, ref: 'Patient' },
  departmentId: { type: mongoose.Types.ObjectId, required: true, ref: 'Department' },
  collectionDate: { type: Date, required: true },
  physicianName: { type: String, required: true },
  tissueType: { type: String, required: true },
  processIds: { type: [mongoose.Types.ObjectId], required: true, ref: 'Process' },
  currentProcessId: { type: mongoose.Types.ObjectId, required: true, ref: 'Process' },
  status: { type: String, required: true, enum: Object.values(SampleStatus) },
}, { timestamps: true });

export const Sample = mongoose.model<ISample>('Sample', SampleSchema);
