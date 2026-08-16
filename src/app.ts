import process from "node:process";

import express, { type Express, type Request, type Response } from "express";
import taskRouter from "./routes/task.routes";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/tasks", taskRouter);

  return app;
}
