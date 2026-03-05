import type { PrismaClient } from "../generated/client.js";
import type { UserBook, UserBookStatus } from "../types/userBook.js";

export interface IUserBookRepository {
  addNew(data: Pick<UserBook, "bookId" | "userId">): Promise<UserBook>;
  updateStatus(
    userId: string,
    bookId: string,
    status: UserBookStatus,
  ): Promise<UserBook>;
  getListByUser(userId: string, status?: UserBookStatus): Promise<UserBook[]>;
  getByUserNBookIds(userId: string, bookId: string): Promise<UserBook | null>;
}
export class UserBookRepository implements IUserBookRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async addNew(data: Pick<UserBook, "bookId" | "userId">): Promise<UserBook> {
    const userBook = await this.prismaClient.userBook.create({
      data,
    });

    return { ...userBook, status: userBook.status as UserBookStatus };
  }
  async updateStatus(
    userId: string,
    bookId: string,
    status: UserBookStatus,
  ): Promise<UserBook> {
    const userBook = await this.prismaClient.userBook.update({
      where: { userId_bookId: { userId, bookId } },
      data: { status },
    });

    return { ...userBook, status: userBook.status as UserBookStatus };
  }
  async getListByUser(
    userId: string,
    status?: UserBookStatus,
  ): Promise<UserBook[]> {
    const userBooks = await this.prismaClient.userBook.findMany({
      where: status ? { userId, status } : { userId },
    });

    return userBooks as UserBook[];
  }
  async getByUserNBookIds(
    userId: string,
    bookId: string,
  ): Promise<UserBook | null> {
    const userBook = await this.prismaClient.userBook.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    return userBook ? (userBook as UserBook) : null;
  }
}
