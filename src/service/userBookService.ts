import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { IUserBookRepository } from "../repository/userBookRepository.js";
import type { UserBook, UserBookStatus } from "../types/userBook.js";
import { BadRequestError, NotFoundError } from "../utils/httpErrors.js";

export interface IUserBookService {
  getUserBooks(userId: string, status?: UserBookStatus): Promise<UserBook[]>;
  addBookToUser(userId: string, bookId: string): Promise<UserBook>;
  changeStatus(
    userId: string,
    bookId: string,
    status: string,
  ): Promise<UserBook>;
}

export class UserBookService implements IUserBookService {
  constructor(private readonly userBookRepository: IUserBookRepository) {}
  async getUserBooks(
    userId: string,
    status?: UserBookStatus,
  ): Promise<UserBook[]> {
    const books = await this.userBookRepository.getListByUser(userId, status);

    return books;
  }

  async addBookToUser(userId: string, bookId: string): Promise<UserBook> {
    try {
      return await this.userBookRepository.addNew({ userId, bookId });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestError("Book already in user list");
      }
      throw error;
    }
  }

  async changeStatus(
    userId: string,
    bookId: string,
    status: UserBookStatus,
  ): Promise<UserBook> {
    const userBook = await this.userBookRepository.getByUserNBookIds(
      userId,
      bookId,
    );

    if (!userBook) {
      throw new NotFoundError("User Book not found");
    }

    if (userBook.status === "to_read" && status === "done") {
      throw new BadRequestError(
        "Status can't be set to 'done' while 'to_read'",
      );
    }

    return await this.userBookRepository.updateStatus(userId, bookId, status);
  }
}
