import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env";
import { AppError } from "../errors/app-error";

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const normalized = normalizeError(err);
  const isAppError = normalized instanceof AppError;

  const statusCode = isAppError ? normalized.statusCode : 500;
  const code = isAppError ? normalized.code : "INTERNAL_SERVER_ERROR";
  const message = isAppError ? normalized.message : "Something went wrong";

  if (!isAppError || statusCode >= 500) {
    console.error("[error]", normalized);
  }

  const body: ErrorResponse = {
    error: { code, message },
  };

  if (isAppError && normalized.details !== undefined) {
    body.error.details = normalized.details;
  }

  if (!env.isProduction && normalized instanceof Error && normalized.stack !== undefined) {
    body.error.stack = normalized.stack;
  }

  res.status(statusCode).json(body);
}

function normalizeError(err: unknown): unknown {
  if (err instanceof SyntaxError && "body" in err) {
    return AppError.badRequest("Malformed JSON in request body");
  }
  return err;
}
