import { Response } from "express";

export const sendResponse = (
  statusCode: number,
  success: boolean,
  message: string,
  data: any,
  res: Response
) => {
  res.status(statusCode).json({
   
    status: statusCode,
    success: success,
    message,
    data,
  });
};
