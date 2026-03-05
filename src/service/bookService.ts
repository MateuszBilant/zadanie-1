import type { IBookRepository } from "../repository/bookRepository.js";
import type { Book, CreateBookDto } from "../types/book.js";
import { NotFoundError } from "../utils/httpErrors.js";

export interface IBookService {
  getList(author?: string): Promise<Book[]>;
  getBookDetails(id: string): Promise<Book>;
  addNew(data: CreateBookDto): Promise<Book>;
}

export class BookService implements IBookService {
  constructor(private readonly bookRepository: IBookRepository) {}
  async getList(author?: string): Promise<Book[]> {
    return await this.bookRepository.getList(author);
  }
  async getBookDetails(id: string): Promise<Book> {
    const book = await this.bookRepository.getById(id);

    if (!book) {
      throw new NotFoundError("Book not found");
    }

    return book;
  }
  async addNew(data: CreateBookDto): Promise<Book> {
    const book = await this.bookRepository.addNew(data);

    return book;
  }
}
