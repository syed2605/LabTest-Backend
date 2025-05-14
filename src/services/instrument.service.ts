import { Instrument } from '../models/instrument.model';
import { IInstrument } from '../interfaces/model.interfaces';

export const getInstruments = async (
    filter: any = {},
    sortOptions: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' },
    skip: number = 0,
    limit: number = 10
): Promise<{ instruments: IInstrument[]; total: number }> => {
    const instruments = await Instrument.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    const total = await Instrument.countDocuments(filter);
    return { instruments, total };
};

export const createInstrument = async (data: IInstrument): Promise<IInstrument> => {
    const instrument = new Instrument(data);
    await instrument.save();
    return instrument;
};

export const getInstrumentById = async (id: string): Promise<IInstrument | null> => {
    return await Instrument.findById(id);
};

export const updateInstrument = async (id: string, data: IInstrument): Promise<IInstrument | null> => {
    return await Instrument.findByIdAndUpdate(id, data, { new: true });
};

