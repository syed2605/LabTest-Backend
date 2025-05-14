import { Process } from '../models/process.model';

export const getAllProcesses = async () => {
    return await Process.find();
};

export const createProcess = async (processData: any) => {
    const process = new Process(processData);
    return await process.save();
};

export const getProcessById = async (id: string) => {
    const process = await Process.findById(id);
    if (!process) {
        throw new Error('Process not found');
    }
    return process;
};

export const updateProcess = async (id: string, processData: any) => {
    const process = await Process.findByIdAndUpdate(id, processData, { new: true });
    if (!process) {
        throw new Error('Process not found');
    }
    return process;
};
