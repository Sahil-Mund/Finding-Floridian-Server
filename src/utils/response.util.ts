import { Response } from "express";
export enum ResponseStatusCodes {
  success = 200,
  unprocessable = 422,
  bad_request = 400,
  not_found = 404,
  authenticate_failed = 401,
  internal_server_error = 500,
}

export function successResponse(message: string, DATA: any, res: Response) {
  res.status(ResponseStatusCodes.success).json({
    STATUS: "SUCCESS",
    MESSAGE: message,
    DATA,
  });
}

export function notFoundResponse(message: string, DATA: any, res: Response) {
  res.status(ResponseStatusCodes.not_found).json({
    STATUS: "FAILURE",
    MESSAGE: message,
    DATA,
  });
}

export function badRequest(message: string, DATA: any, res: Response) {
  res.status(ResponseStatusCodes.bad_request).json({
    STATUS: "FAILURE",
    MESSAGE: message,
    DATA: DATA,
  });
}

export function authenticateFailed(res: Response, message: string) {
  res.status(ResponseStatusCodes.authenticate_failed).json({
    STATUS: "FAILURE",
    MESSAGE: message,
  });
}

export function serverError(err: any, res: Response) {
  res.status(ResponseStatusCodes.internal_server_error).json({
    STATUS: "FAILURE",
    MESSAGE: "Internal server error",
    DATA: err,
  });
}
