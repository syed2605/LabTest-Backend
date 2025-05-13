import mongoose, { Schema } from 'mongoose';
import { IResult } from '../interfaces/model.interfaces';

const ResultSchema = new Schema<IResult>({
  sampleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Sample' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
  processId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Process' },
  resultSummary: { type: String, required: true },
}, { timestamps: true });

export const Result = mongoose.model<IResult>('Result', ResultSchema);
