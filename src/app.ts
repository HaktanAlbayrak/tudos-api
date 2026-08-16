import process from "node:process";

import express, { type Express, type Request, type Response } from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import taskRoutes from "./routes/task.routes";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  app.use("/api/tasks", taskRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
