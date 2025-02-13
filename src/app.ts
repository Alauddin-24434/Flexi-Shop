
import express, { Application, NextFunction, Request, Response }  from 'express';
import cors from 'cors';
import dotenv  from 'dotenv';
import cookieParser from 'cookie-parser';
import { globalErrorHandelelr } from './app/utills/globalErrorHandeller';
import { authRouter } from './app/modules/Auth/auth.route';

dotenv.config();

const app :Application = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser())



// response testing
 app.get('/', (req:Request, res:Response)=>{
    res.status(200).json({
        success:true,
        message:"Hello world",
    })
 })


// API routes
app.use('/api', authRouter);


//  not found page

app.use( '/' ,(req:Request, res:Response)=>{
   res.status(404).json({
    success:false,
    message:"Ops! api not found",
   })
})


// error handeller

app.use(globalErrorHandelelr);


export default app;