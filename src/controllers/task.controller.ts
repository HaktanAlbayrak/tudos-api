import type { Request, Response } from "express";

import { AppError } from "../errors/app-error";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";
import * as taskService from "../services/task.service";

interface TaskIdParams {
  id: string;
}

export function getAll(_req: Request, res: Response): void {
  res.status(200).json(taskService.findAll());
}

export function getById(req: Request<TaskIdParams>, res: Response): void {
  const task = taskService.findById(req.params.id);
  if (task === null) throw AppError.notFound(`Task not found: ${req.params.id}`);

  res.status(200).json(task);
}

export function create(
  req: Request<Record<string, string>, unknown, CreateTaskInput>,
  res: Response,
): void {
  res.status(201).json(taskService.create(req.body));
}

export function update(req: Request<TaskIdParams, unknown, UpdateTaskInput>, res: Response): void {
  const task = taskService.update(req.params.id, req.body);
  if (task === null) throw AppError.notFound(`Task not found: ${req.params.id}`);

  res.status(200).json(task);
}

export function remove(req: Request<TaskIdParams>, res: Response): void {
  const deleted = taskService.remove(req.params.id);
  if (!deleted) throw AppError.notFound(`Task not found: ${req.params.id}`);

  res.status(204).send();
}
