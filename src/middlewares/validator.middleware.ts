import { Request, Response, NextFunction } from "express";
import { badRequest } from "../utils/response.util";
import { AnyZodObject } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return badRequest("Insufficient parameters !", e.errors, res);
    }
  };

export default validate;
