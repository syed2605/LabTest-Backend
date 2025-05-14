import { addProgress, signOffSample } from "../controller/progress.controller";

const express = require("express");
const progressRouter = express.Router();


progressRouter.post('/addProcess', addProgress)
progressRouter.post('/signoff/:status', signOffSample)
export default progressRouter