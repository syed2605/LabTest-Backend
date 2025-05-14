import { addProgress, signOffSample } from "../controller/progress.controller";
import authenticateToken from "../middleware/authMiddleware";

const express = require("express");
const progressRouter = express.Router();

progressRouter.post("/addProcess", authenticateToken, addProgress);
progressRouter.post("/signoff/:status", authenticateToken, signOffSample);
export default progressRouter;
