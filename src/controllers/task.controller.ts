import type { Request, Response } from "express";

import * as taskService from "../services/task.service";
import type { CreateTaskDto, UpdateTaskDto } from "../types/task.types";

/**
 * Route params for endpoints under /api/tasks/:id
 */
interface TaskIdParams {
  id: string;
}

export function getAll(_req: Request, res: Response): void {
  const tasks = taskService.findAll();
  res.status(200).json(tasks);
}

export function getById(req: Request<TaskIdParams>, res: Response): void {
  const { id } = req.params;

  const task = taskService.findById(id);
  if (task === null) {
    res.status(404).json({ message: `Task not found: ${id}` });
    return;
  }

  res.status(200).json(task);
}

export function create(
  req: Request<Record<string, string>, unknown, CreateTaskDto>,
  res: Response,
): void {
  const task = taskService.create(req.body);
  res.status(201).json(task);
}

export function update(req: Request<TaskIdParams, unknown, UpdateTaskDto>, res: Response): void {
  const { id } = req.params;

  const task = taskService.update(id, req.body);
  if (task === null) {
    res.status(404).json({ message: `Task not found: ${id}` });
    return;
  }

  res.status(200).json(task);
}

export function remove(req: Request<TaskIdParams>, res: Response): void {
  const { id } = req.params;

  const deleted = taskService.remove(id);
  if (!deleted) {
    res.status(404).json({ message: `Task not found: ${id}` });
    return;
  }

  res.status(204).send();
}
