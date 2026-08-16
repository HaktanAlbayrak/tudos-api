import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError, type ZodType } from 'zod';

import { AppError } from '../errors/app-error';

type Source = 'body' | 'params' | 'query';

export function validate(schema: ZodType, source: Source = 'body'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(AppError.badRequest('Validation failed', formatZodError(result.error)));
      return;
    }

    if (source === 'body') {
      req.body = result.data;
    } else {
      Object.assign(req[source], result.data);
    }

    next();
  };
}

function formatZodError(error: ZodError): Array<{ path: string; message: string }> {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}
