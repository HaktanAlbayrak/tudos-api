import { z } from "zod";

import { TASK_STATUSES } from "../types/task.types";

export const taskStatusSchema = z.enum(TASK_STATUSES);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one of: title, description, status",
    path: ["body"],
  });

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Invalid task id"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParams = z.infer<typeof taskIdParamSchema>;
