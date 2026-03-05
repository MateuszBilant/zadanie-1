import type { Request, Response } from "express";

export interface IHttpError {
  message: string;
  status: number;
  handle(req: Request, res: Response): void;
}

export abstract class HttpError extends Error implements IHttpError {
  constructor(
    public readonly message: string,
    public readonly status: number,
  ) {
    super();
  }
  handle(req: Request, res: Response): void {
    res.send(this.status).json({ error: this.message });
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message: string) {
    super(message, 422);
  }
}

export class InternalError extends HttpError {
  constructor(message: string) {
    super(message, 500);
  }
}
