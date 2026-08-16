import { Router } from "express";

import * as taskController from "../controllers/task.controller";
import { validate } from "../middlewares/validate";

import {
  type CreateTaskInput,
  createTaskSchema,
  type TaskIdParams,
  taskIdParamSchema,
  type UpdateTaskInput,
  updateTaskSchema,
} from "../schemas/task.schema";

const router = Router();

router.get("/", taskController.getAll);

router.post<Record<string, string>, unknown, CreateTaskInput>(
  "/",
  validate(createTaskSchema),
  taskController.create,
);

router.get<TaskIdParams>("/:id", validate(taskIdParamSchema, "params"), taskController.getById);

router.patch<TaskIdParams, unknown, UpdateTaskInput>(
  "/:id",
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  taskController.update,
);

router.delete<TaskIdParams>("/:id", validate(taskIdParamSchema, "params"), taskController.remove);

export default router;
