import express from "express";
import { userBookController } from "../ioc.js";

export const userBookRouter = express.Router();

userBookRouter.get("/:userId/books", userBookController.getUserBooks);

userBookRouter.post("/:userId/books/:bookId", userBookController.addBookToUser);

userBookRouter.patch("/:userId/books/:bookId", userBookController.changeStatus);
