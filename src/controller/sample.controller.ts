import mongoose from "mongoose";
import { Request, Response } from "express";
import {
  addNewSample,
  convertSampleData,
  getAllSampleData,
  getAllSampleDataByPatient,
  getSampleById,
  updateSampleCurrentProcess,
} from "./../services/sample.service";
import { SampleService } from "../services/sample.service";
import { errorResponse, successResponse } from "../utils/user.utils";
import { IProcess, ISample } from "../interfaces/model.interfaces";
import {
  AllSampleDataInterface,
  PaginationOptions,
} from "../interfaces/common.interfaces";
import { getProcessById } from "../services/process.service";

export const getSamplebyCurrentId = async (req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const data = await SampleService.getSamplebyProcessId(id);
    res.status(200).json(successResponse(data, "Progress Added successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Progress currentid error", error));
  }
};

export const getSamplebyStatus = async (req: Request, res: Response) => {
  try {
    const id = req.query.status as string;
    console.log("status check", id);
    const data = await SampleService.getSamplebyStatus(id);
    res.status(200).json(successResponse(data, "Progress Added successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Progress error", error));
  }
};

export const addSample = async (req: Request, res: Response): Promise<void> => {
  try {

    const finalBody = {...req.body}
    const { processIds } = req.body;
    console.log(processIds);
    const promises: Promise<IProcess>[] = processIds.map(
      async (processId: string) => {
        let processData = await getProcessById(processId);
        console.log(processData);
        return processData;
      }
    );
    let process = await Promise.all(promises);

    // 1. Find the minimum value for the specified key
    const minimumValue = process.reduce((min, obj) => {
      return Math.min(min, obj["sequence"]);
    }, Infinity); // Initialize with Infinity to ensure the first value is smaller

    // 2. Filter the array to include only objects with the minimum value for the key
    const filteredArray = process.filter((obj) => obj["sequence"] === minimumValue);
    finalBody.currentProcessId = filteredArray[0]?._id
    console.log("All Process", process);
    const savedSample: ISample | null = await addNewSample(finalBody);
    res
      .status(201)
      .json(successResponse(savedSample, "Sample Added successfully"));
  } catch (error: any) {
    console.error("Error creating sample in controller:", error);
    res.status(500).json(errorResponse("Error creating sample ", error));
  }
};

export const updateSample = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const existingSample: ISample | null = await getSampleById(req?.params?.id);
    let updatedSample: ISample | null;
    if (existingSample) {
      updatedSample = await updateSampleCurrentProcess(
        existingSample,
        req.body
      );
      res
        .status(201)
        .json(successResponse(updatedSample, "Sample Updated successfully"));
    }
    res.status(404).json(errorResponse("sample Not found"));
  } catch (error: any) {
    console.error("Error updating sample in controller:", error);
    res.status(500).json(errorResponse("Error updating sample", error));
  }
};

export const getAllSample = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pageOptions: PaginationOptions = {
      page: parseInt(req.query.page as string),
      limit: parseInt(req.query.limit as string),
    };
    const searchQuery = req.query.search as string | undefined;

    const savedSample = await getAllSampleData(pageOptions, searchQuery);
    console.log("Saved samples", savedSample);
    const finalSampleData: AllSampleDataInterface[] | null =
      await convertSampleData(savedSample?.sample);
    const data = {
      data: finalSampleData,
      totalCount: savedSample?.totalCount,
      totalPages: savedSample?.totalPages,
      currentPage: savedSample?.currentPage,
    };
    res.status(200).json(successResponse(data, "Sample Fetched successfully"));
  } catch (error: any) {
    console.error("Error In Fetching sample in controller:", error);
    res.status(500).json(errorResponse("Error Fetching sample ", error));
  }
};

export const getAllSampleByPatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pageOptions: PaginationOptions = {
      page: parseInt(req.query.page as string),
      limit: parseInt(req.query.limit as string),
    };
    const patientId = req.params.id;

    const savedSample = await getAllSampleDataByPatient(pageOptions, patientId);
    console.log("Saved samples", savedSample);
    const finalSampleData: AllSampleDataInterface[] | null =
      await convertSampleData(savedSample?.sample);
    const data = {
      data: finalSampleData,
      totalCount: savedSample?.totalCount,
      totalPages: savedSample?.totalPages,
      currentPage: savedSample?.currentPage,
    };
    res.status(200).json(successResponse(data, "Sample Fetched successfully"));
  } catch (error: any) {
    console.error("Error In Fetching sample in controller:", error);
    res.status(500).json(errorResponse("Error Fetching sample ", error));
  }
};
