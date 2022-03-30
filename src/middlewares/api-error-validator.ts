import { NextFunction, Response, Request } from 'express';
import APIError from '@src/utils/errors/api-error';

export interface HTTPError extends Error {
  status?: number;
}

export function apiErrorValidator(
  error: HTTPError,
  _: Partial<Request>,
  response: Response,
  __: NextFunction
): void {
  const errorCode = error.status || 500;
  response.status(errorCode).send(
    APIError.format({
      code: errorCode,
      message: error.message,
    })
  );
}
