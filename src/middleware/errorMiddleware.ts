import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpErrors.js";

interface ErrorResponse {
  error: {
    message: string;
    errorCode: string;
    stack?: string;
  };
}

export const errorHandlerMiddleware = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Error) {
    console.error(err.message);
  }

  const response: ErrorResponse = {
    error: {
      message: err.message || "Something went wrong.",
      errorCode:
        err instanceof HttpError
          ? err.status.toString()
          : "INTERNAL_SERVER_ERROR",
    },
  };

  const statusCode = err instanceof HttpError ? err.status : 500;

  res.status(statusCode).json(response);
};
