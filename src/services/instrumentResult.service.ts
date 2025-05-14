import { InstrumentResult } from '../models/instrumentResult.model';
import { IInstrumentResult } from '../interfaces/model.interfaces';

export const getInstrumentResults = async (
    filter: any = {},
    sortOptions: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' },
    skip: number = 0,
    limit: number = 10
): Promise<{ instrumentResults: IInstrumentResult[]; total: number }> => {
    const instrumentResults = await InstrumentResult.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    const total = await InstrumentResult.countDocuments(filter);
    return { instrumentResults, total };
};

export const createInstrumentResult = async (data: IInstrumentResult): Promise<IInstrumentResult> => {
    const instrumentResult = new InstrumentResult(data);
    await instrumentResult.save();
    return instrumentResult;
};

export const getInstrumentResultById = async (id: string): Promise<IInstrumentResult | null> => {
    return await InstrumentResult.findById(id);
};

export const updateInstrumentResult = async (id: string, data: IInstrumentResult): Promise<IInstrumentResult | null> => {
    return await InstrumentResult.findByIdAndUpdate(id, data, { new: true });
};

