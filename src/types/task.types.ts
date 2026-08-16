export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * POST /api/tasks - body
 */
export interface CreateTaskDto {
  title: string;
  description?: string | null;
  status?: TaskStatus;
}

/**
 * PATCH /api/tasks/:id - optional body
 */
export type UpdateTaskDto = Partial<CreateTaskDto>;


