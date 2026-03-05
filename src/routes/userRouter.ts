import express from "express";
import { userController } from "../ioc.js";

export const userRouter = express.Router();

userRouter.get("/:userId/books", userController.getUserBooks);

userRouter.post("/:userId/books/:bookId", userController.addBookToUser);

userRouter.patch("/:userId/books/:bookId", userController.changeStatus);
