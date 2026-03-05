import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { ShutdownManager } from "./utils/ShutdownManager.js";
import { AppConfig } from "./utils/appConfig.js";
import { prismaClient } from "./ioc.js";
import { errorHandlerMiddleware } from "./middleware/errorMiddleware.js";
import { bookRouter } from "./routes/bookRouter.js";
import { userBookRouter } from "./routes/userBookRouter.js";

export const app = express();

app.use(express.json());

const port = AppConfig.getPort();

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.use("/books", bookRouter);

app.use("/users", userBookRouter);

app.use(errorHandlerMiddleware);

ShutdownManager.init(app, {
  connectionTimeout: 5000,
  prisma: prismaClient,
});

const server = app.listen(port, async () => {
  console.info(`Example app listening on port ${port}`);
});

server.timeout = 30000;
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

ShutdownManager.registerHttpServer(server);
