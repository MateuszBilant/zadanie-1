import express from "express";
import { bookController } from "../ioc.js";

export const bookRouter = express.Router();

bookRouter.get("/", bookController.getList);

bookRouter.get("/:id", bookController.getBookDetails);

bookRouter.post("/", bookController.addNew);
