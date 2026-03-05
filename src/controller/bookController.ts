import type { NextFunction, Request, Response } from "express";
import type {
  AddNewBookRequest,
  GetBookDetailsRequest,
  GetBookListRequest,
} from "../types/book.js";
import type { IBookService } from "../service/bookService.js";

export class BookController {
  constructor(private readonly bookService: IBookService) {}
  getList = async (
    req: GetBookListRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const author = req.query.author;

      const list = await this.bookService.getList(author);

      res.status(200).json({ data: list });
    } catch (error) {
      next(error);
    }
  };
  getBookDetails = async (
    req: GetBookDetailsRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;

      const details = await this.bookService.getBookDetails(id);

      res.status(200).json({ data: details });
    } catch (error) {
      next(error);
    }
  };
  addNew = async (
    req: AddNewBookRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bookData = req.body;

      const book = await this.bookService.addNew(bookData);

      res.status(201).json({ data: book });
    } catch (error) {
      next(error);
    }
  };
}
