import { IResult } from "../interfaces/model.interfaces";
import { Result } from "../models/result.model";

export const progressService={

    addProgress: async (progress : IResult) :  Promise<IResult | null> => {
            try {
                const progressCreated = new Result(progress);
                return await progressCreated.save();
            } catch (error: any) {
                console.error('Error creating Progress in service:', error);
                if (error.status) {
                    throw error;
                }
                throw { status: 500, message: 'Error creating Progressxxx' };
            }
           },
        }