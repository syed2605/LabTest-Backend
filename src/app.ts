import express from "express";
import cors from "./config/cors";
import cookieParser from "cookie-parser";
import userRouter from '../src/routes/user.route'
import departmentsRouter from '../src/routes/departments.routes'
import instrumentResultRouter from '../src/routes/instrumentResults.routes'
import instrumentsRouter from '../src/routes/instruments.routes'
import processRouter from '../src/routes/process.routes'
import progressRouter from "../src/routes/progress.route";
const app = express();

app.use(cors);
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter)
app.use('/api/department', departmentsRouter)
app.use('/api/instrument', instrumentResultRouter)
app.use('/api/instrumentResult', instrumentsRouter)
app.use('/api/process', processRouter)
app.use('/api/progress', progressRouter)

// initSocket(server)

 

export default app;