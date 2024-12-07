import { NextFunction, Request, Response } from "express";
import { z } from "zod";
export const parseFormData = (
  schema: z.ZodType
) => {
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.data) {
      return next();
    }    
    req.body = schema.parse(JSON.parse(req.body.data));
    next();
  };
};