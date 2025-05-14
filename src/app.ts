import express from "express";
import cors from "./config/cors";
import cookieParser from "cookie-parser";
import userRouter from '../src/routes/user.route'
import progressRouter from "../src/routes/progress.route";
const app = express();
// const server = http.createServer(app)
app.use(cors);
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter)
app.use('/api/progress', progressRouter)

// initSocket(server)

 

export default app;