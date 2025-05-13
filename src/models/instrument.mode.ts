import mongoose, { Schema } from 'mongoose';
import { IInstrument } from '../interfaces/model.interfaces';

const InstrumentSchema = new Schema<IInstrument>({
  name: { type: String, required: true },
}, { timestamps: true });

export const Instrument = mongoose.model<IInstrument>('Instrument', InstrumentSchema);
