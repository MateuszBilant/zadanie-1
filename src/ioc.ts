import { PrismaClient } from "./generated/client.js";
import { BookController } from "./controller/bookController.js";
import { UserBookController } from "./controller/userBookController.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { BookRepository } from "./repository/bookRepository.js";
import { UserBookRepository } from "./repository/userBookRepository.js";
import { BookService } from "./service/bookService.js";
import { UserBookService } from "./service/userBookService.js";

const adapter = new PrismaBetterSqlite3({ url: "./dev.db" });

export const prismaClient = new PrismaClient({
  adapter,
});

export const bookRepository = new BookRepository(prismaClient);
export const userBookRepository = new UserBookRepository(prismaClient);

export const bookService = new BookService(bookRepository);
export const userBookService = new UserBookService(userBookRepository);

export const bookController = new BookController(bookService);
export const userBookController = new UserBookController(userBookService);
