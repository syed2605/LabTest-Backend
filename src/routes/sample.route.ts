const express = require("express");
import { addSample,getAllSample, getSamplebyCurrentId, getSamplebyStatus } from "../controller/sample.controller";
import authenticateToken from "../middleware/authMiddleware";
import { sampleCreateValidator } from "../validators/sample.validator";

const router = express.Router();

router.post('/addSample', authenticateToken,sampleCreateValidator,addSample)
router.get('/getAllSample', authenticateToken,getAllSample)
router.get("/status", authenticateToken,getSamplebyStatus);
router.get("/detail/:id",authenticateToken, getSamplebyCurrentId);

export default router;