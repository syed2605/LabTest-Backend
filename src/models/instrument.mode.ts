import mongoose, { Schema } from 'mongoose';
import { IInstrument } from '../interfaces/instrument.interfaces';

const InstrumentSchema = new Schema<IInstrument>({
  name: { type: String, required: true },
}, { timestamps: true });

export const Instrument = mongoose.model<IInstrument>('Instrument', InstrumentSchema);
