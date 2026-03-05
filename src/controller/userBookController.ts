import type { NextFunction, Request, Response } from "express";
import type {
  AddBookToUserRequest,
  ChangeStatusRequest,
  GetUserBooksRequest,
} from "../types/userBook.js";
import type { IUserBookService } from "../service/userBookService.js";
export class UserBookController {
  constructor(private readonly userBookService: IUserBookService) {}
  getUserBooks = async (
    req: GetUserBooksRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.params.userId;
      const status = req.query.status;

      const userBooks = await this.userBookService.getUserBooks(userId, status);

      res.status(200).json({ data: userBooks });
    } catch (error) {
      next(error);
    }
  };
  addBookToUser = async (
    req: AddBookToUserRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId, bookId } = req.params;

      const userBook = await this.userBookService.addBookToUser(userId, bookId);

      res.status(201).json({ data: userBook });
    } catch (error) {
      next(error);
    }
  };
  changeStatus = async (
    req: ChangeStatusRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId, bookId } = req.params;
      const { status } = req.body;

      const userBook = await this.userBookService.changeStatus(
        userId,
        bookId,
        status,
      );

      res.status(200).json({ data: userBook });
    } catch (error) {
      next(error);
    }
  };
}
