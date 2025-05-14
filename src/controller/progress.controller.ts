import { Response } from "express";
import { IResult, ISample, SampleStatus } from "../interfaces/model.interfaces";
import { progressService } from "../services/progress.service";
import { errorResponse, successResponse } from "../utils/user.utils";
import { Sample } from "../models/sample.model";

export const addProgress = async (req: any, res: Response): Promise<void> => {
  //add-progress
  try {
    const newProgress: IResult | null = await progressService.addProgress(
      req.body
    );
    res
      .status(200)
      .json(successResponse(newProgress, "Progress Added successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to submit Progress", error));
  }

  //get sample id
  const SampleDetails = (await Sample.findById(
    req.body.sampleId
  )) as ISample | null;

  if (!SampleDetails) throw new Error("SampleDetails not found");
  //edit sample details-> currentProcess id or status
  const currentIndex = SampleDetails.processIds.findIndex(
    (id) => id.toString() === SampleDetails.currentProcessId.toString()
  );

  const isLastProcess = currentIndex === SampleDetails.processIds.length - 1;

  if (isLastProcess) {
    SampleDetails.status = SampleStatus.COMPLETED;
  } else {
    SampleDetails.currentProcessId = SampleDetails.processIds[currentIndex + 1];
  }

  await SampleDetails.save();
};

export const signOffSample = async (req: any, res: any) => {
  //-> get sample details based on sampleid
    const SampleDetails = (await Sample.findById(req.body.sampleId)) as ISample;
  const isApproved = req.params.status === "approved";
  console.log(req.params);
    if (isApproved) {
      SampleDetails.status = SampleStatus.APPROVED;
    } else {
      //signoffrejected
      // 1. Updated isRejected: true
      SampleDetails.isRejected = true;
      // 2. updated rejected_process_id
      SampleDetails.rejectedProcessIds = req.body.rejectedProcessId;
      //3. update currentProcessIds 
      SampleDetails.currentProcessId= req.body.rejectedProcessId[0];
      // 3. update status to in-progress
      SampleDetails.status = SampleStatus.IN_PROGRESS;
    }

    await SampleDetails.save();
};
