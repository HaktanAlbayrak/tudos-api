import { randomUUID } from "node:crypto";
import type { CreateTaskDto, Task, UpdateTaskDto } from "../types/task.types";

const tasks: Task[] = [];

export function findAll(): Task[] {
  return [...tasks];
}

export function findById(id: string): Task | null {
  return tasks.find((task) => task.id === id) ?? null;
}

export function create(dto: CreateTaskDto): Task {
  const now = new Date();

  const task: Task = {
    id: randomUUID(),
    title: dto.title,
    description: dto.description ?? null,
    status: dto.status ?? "pending",
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  return task;
}

export function update(id: string, dto: UpdateTaskDto): Task | null {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  const current = tasks[index];
  if (current === undefined) return null;

  const updated: Task = {
    ...current,
    ...(dto.title !== undefined && { title: dto.title }),
    ...(dto.description !== undefined && { description: dto.description }),
    ...(dto.status !== undefined && { status: dto.status }),
    updatedAt: new Date(),
  };

  tasks[index] = updated;
  return updated;
}

export function remove(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
