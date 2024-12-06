import { NextFunction, Request, Response } from "express";
import { z } from "zod";
export const parseFormData = (
  schema: z.ZodType
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(JSON.parse(req.body.data));
    next();
  };
};