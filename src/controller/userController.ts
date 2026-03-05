import type { NextFunction, Request, Response } from "express";
export class UserController {
  constructor() {}
  getUserBooks = async (
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
  addBookToUser = async (
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
  changeStatus = async (
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
}
