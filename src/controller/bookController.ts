import type { NextFunction, Request, Response } from "express";

export class BookController {
  constructor() {}
  getList = async (
    req: Request<unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
  getBookDetails = async (
    req: Request<unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
  addNew = async (req: Request<unknown>, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}
