import {
  AllSampleDataInterface,
  PaginationOptions,
} from "../interfaces/common.interfaces";
import {
  IDepartment,
  IProcess,
  ISample,
  IUser,
} from "../interfaces/model.interfaces";
import { Sample } from "./../models/sample.model";
import mongoose from "mongoose";
import { userService } from "./user.service";
import { getDepartmentById } from "./department.service";
import { getProcessById } from "./process.service";

export const SampleService = {
  getSamplebyProcessId: async (id: string, page: number, limit: number) => {
    limit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * limit;

    const sample = await Sample.find({
      currentProcessId: id,
      status: { $nin: ["completed", "approved"] },
    })
      .skip(skip)
      .limit(limit);
    return sample;
  },
  getSamplebyStatus: async (status: string) => {
    console.log("status", status);
    const sample = await Sample.find({ status: status });
    return sample;
  },
  getSamplebyId: async (id: string) => {
    const sample = await Sample.findById(id);
    return sample;
  },
};

export const addNewSample = async (
  sampleData: ISample
): Promise<ISample | null> => {
  const addedSample = new Sample(sampleData);
  return await addedSample.save();
};

export const getSampleById = async (_id: string): Promise<ISample | null> => {
  const sample = await Sample.findOne({ _id });
  return sample;
};

export const updateSampleCurrentProcess = async (
  sample: ISample,
  currentProcessId: mongoose.Schema.Types.ObjectId
): Promise<ISample> => {
  sample.currentProcessId = currentProcessId;
  return await sample.save();
};

export const getAllSampleData = async (
  paginationOptions: PaginationOptions,
  searchQuery?: string
): Promise<{
  sample: ISample[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> => {
  const { page = 1, limit = 10 } = paginationOptions;
  const skip = (page - 1) * limit;
  const query: any = {}; // Initialize an empty query object

  if (searchQuery) {
    // Define the fields you want to search across
    const searchFields = ['physicianName', 'status', 'tissueType']; // Add more fields as needed
    const orConditions = searchFields.map((field) => ({
      [field]: { $regex: new RegExp(searchQuery, 'i') }, // 'i' for case-insensitive search
    }));
    query.$or = orConditions;
  }

  try {
    const samplesPromise = Sample.find(query).skip(skip).limit(limit).exec();
    const countPromise = Sample.countDocuments(query).exec();

    const [sample, totalCount] = await Promise.all([samplesPromise, countPromise]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;

    return {
      sample,
      totalCount,
      totalPages,
      currentPage,
    };
  } catch (error: any) {
    console.error("Error fetching trials with pagination in service:", error);
    if (error.status) {
      throw error;
    }
    throw { status: 500, message: "Error fetching Trials with pagination" };
  }
};

export const getAllSampleDataByPatient = async (
  paginationOptions: PaginationOptions,
  patientId?: string
): Promise<{
  sample: ISample[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> => {
  const { page = 1, limit = 10 } = paginationOptions;
  const skip = (page - 1) * limit;
  const query: any = {}; // Initialize an empty query object


  try {
    const samplesPromise = Sample.find({patientId}).skip(skip).limit(limit).exec();
    const countPromise = Sample.countDocuments(query).exec();

    const [sample, totalCount] = await Promise.all([samplesPromise, countPromise]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;

    return {
      sample,
      totalCount,
      totalPages,
      currentPage,
    };
  } catch (error: any) {
    console.error("Error fetching trials with pagination in service:", error);
    if (error.status) {
      throw error;
    }
    throw { status: 500, message: "Error fetching Trials with pagination" };
  }
};

export const convertSampleData = async (
  savedSample: ISample[] | null
): Promise<AllSampleDataInterface[] | null> => {
  if (savedSample === null) {
    return null;
  }

  const promises: Promise<AllSampleDataInterface>[] = savedSample.map(
    async (sample: ISample) => {
      let newData: AllSampleDataInterface = {};
      // Add User Name
      const user: IUser | null = await userService.getUserById(
        sample?.patientId
      );
      if (user) {
        newData.patientName = user.name;
      }
      newData.patientId = sample?.patientId.toString();
      // Add Department Name

      const department: IDepartment | null = await getDepartmentById(
        (sample?.departmentId).toString()
      );
      if (department) {
        newData.departmentName = department.title;
      }
      newData.departmentId = sample?.departmentId.toString();
      // Add Current Process Name

      const process: IProcess = await getProcessById(
        (sample?.currentProcessId).toString()
      );
      if (process) {
        newData.currentProcessName = process.title;
      }

      newData.collectionDate = sample.collectionDate;
      newData.physicianName = sample.physicianName;
      newData.tissueType = sample.tissueType;
      newData.currentProcessId = sample?.currentProcessId
        ? sample?.currentProcessId.toString()
        : "";
      newData.status = sample.status;
      console.log(newData);
      return newData;
    }
  );

  const finalSampleData = await Promise.all(promises);
  console.log(finalSampleData);
  return finalSampleData;
};
