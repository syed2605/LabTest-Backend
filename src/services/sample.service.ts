import { Sample } from "./../models/sample.model";
import mongoose from "mongoose";

export const SampleService = {
  getSamplebyProcessId: async (id: mongoose.Schema.Types.ObjectId) => {
    const sample = await Sample.find({
      currentProcessId: id,
      // status: { $nin: ["completed", "approved"] },
    });
    return sample;
  },
  getSamplebyStatus: async (status: string) => {
    console.log("status", status);
    const sample = await Sample.find({ status: status });
    return sample;
  },
};
