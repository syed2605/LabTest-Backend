import mongoose, { Schema } from 'mongoose';
import { IInstrument, Status } from '../interfaces/model.interfaces';

const InstrumentSchema = new Schema<IInstrument>({
  name: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(Status) },
}, { timestamps: true });

export const Instrument = mongoose.model<IInstrument>('Instrument', InstrumentSchema);
