const express = require("express");
import {
  addSample,
  getAllSample,
  getSamplebyCurrentId,
  getSamplebyId,
  getSamplebyStatus,
} from "../controller/sample.controller";
import authenticateToken from "../middleware/authMiddleware";
import { sampleCreateValidator } from "../validators/sample.validator";

const router = express.Router();

router.post("/addSample", authenticateToken, sampleCreateValidator, addSample);
router.get("/getAllSample", authenticateToken, getAllSample);
router.get("/status", authenticateToken, getSamplebyStatus);
router.get("/list/:id", authenticateToken, getSamplebyCurrentId);
router.get("/details/:id", authenticateToken, getSamplebyId);

export default router;
