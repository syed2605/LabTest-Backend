import mongoose from "mongoose";
import { SampleService } from "../services/sample.service";
import { errorResponse, successResponse } from "../utils/user.utils";

export const getSamplebyCurrentId = async (req: any, res: any) => {
  try {
    const id = req.params.id as mongoose.Schema.Types.ObjectId;
    const data = await SampleService.getSamplebyProcessId(id);
    res.status(200).json(successResponse(data, "Progress Added successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Progress currentid error", error));
  }
};

export const getSamplebyStatus = async (req: any, res: any) => {
  try {
    const id = req.query.status as string;
    console.log("status check", id);
    const data = await SampleService.getSamplebyStatus(id);
    res.status(200).json(successResponse(data, "Progress Added successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Progress error", error));
  }
};
