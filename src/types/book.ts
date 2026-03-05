import type { Request } from "express";

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  available: boolean;
};

export type CreateBookDto = Pick<Book, "author" | "title" | "year">;

export type GetBookListRequest = Request<{}, {}, {}, { author?: string }>;
export type GetBookDetailsRequest = Request<{ id: string }, {}, {}, {}>;
export type AddNewBookRequest = Request<{}, {}, CreateBookDto, {}>;
