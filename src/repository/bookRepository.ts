import type { PrismaClient } from "../generated/client.js";
import type { Book, CreateBookDto } from "../types/book.js";

export interface IBookRepository {
  addNew(data: CreateBookDto): Promise<Book>;
  getById(id: string): Promise<Book | null>;
  getList(author?: string): Promise<Book[]>;
}

export class BookRepository implements IBookRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async addNew(data: CreateBookDto): Promise<Book> {
    const book = await this.prismaClient.book.create({
      data,
    });

    return book;
  }
  async getById(id: string): Promise<Book | null> {
    const book = await this.prismaClient.book.findUnique({
      where: { id },
    });

    return book;
  }
  async getList(author?: string): Promise<Book[]> {
    const book = await this.prismaClient.book.findMany({
      where: author ? { author } : {},
    });

    return book;
  }
}
