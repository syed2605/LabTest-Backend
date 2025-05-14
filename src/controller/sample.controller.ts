import mongoose from "mongoose";
import { Request, Response } from 'express';
import {  addNewSample, convertSampleData, getAllSampleData, getSampleById, updateSampleCurrentProcess } from './../services/sample.service';
import { SampleService } from "../services/sample.service";
import { errorResponse, successResponse } from "../utils/user.utils";
import { ISample } from '../interfaces/model.interfaces';
import { AllSampleDataInterface, PaginationOptions } from '../interfaces/common.interfaces';

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
    const savedSample: ISample | null = await addNewSample(req.body);
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
    const savedSample = await getAllSampleData(pageOptions);
    console.log("Saved samples",savedSample)
    const finalSampleData : AllSampleDataInterface[] | null = await convertSampleData(savedSample?.sample)
    const data = {
      data : finalSampleData,
      totalCount : savedSample?.totalCount,
      totalPages : savedSample?.totalPages,
      currentPage : savedSample?.currentPage,
    }
      res
      .status(200)
      .json(successResponse(data, "Sample Fetched successfully"));
  } catch (error: any) {
    console.error("Error creating sample in controller:", error);
    res.status(500).json(errorResponse("Error creating sample ", error));
  }
}
