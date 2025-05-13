import mongoose, { Schema } from 'mongoose';
import { IInstrumentResult } from '../interfaces/model.interfaces';

const InstrumentResultSchema = new Schema<IInstrumentResult>({
  sampleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Sample' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
  processId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Process' },
  resultSummary: { type: String, required: true },
  inValidRange: { type: Boolean, required: true },
}, { timestamps: true });

export const InstrumentResult = mongoose.model<IInstrumentResult>('InstrumentResult', InstrumentResultSchema);
