import { PrismaClient } from "@prisma/client/extension";
import { BookController } from "./controller/bookController.js";
import { UserController } from "./controller/userController.js";

export const prismaClient = new PrismaClient();

export const bookController = new BookController();
export const userController = new UserController();
