import { addProgress, signOffSample } from "../controller/progress.controller";
import {
  getSamplebyCurrentId,
  getSamplebyStatus,
} from "../controller/sample.controller";
import authenticateToken from "../middleware/authMiddleware";

const express = require("express");
const SampleRouter = express.Router();
SampleRouter.get("/status", getSamplebyStatus);
SampleRouter.get("/detail/:id", getSamplebyCurrentId);

// SampleRouter.post("/signoff/:status", authenticateToken, signOffSample);
export default SampleRouter;
