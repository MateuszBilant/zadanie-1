import type { Request } from "express";

export type UserBookStatus = "to_read" | "reading" | "done";

export type UserBook = {
  id: string;
  userId: string;
  bookId: string;
  status: UserBookStatus;
  addedAt: Date;
};

export type GetUserBooksRequest = Request<
  { userId: string },
  {},
  {},
  { status?: UserBookStatus }
>;
export type AddBookToUserRequest = Request<
  { userId: string; bookId: string },
  {},
  {},
  {}
>;
export type ChangeStatusRequest = Request<
  { userId: string; bookId: string },
  {},
  { status: UserBookStatus },
  {}
>;
