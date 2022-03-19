import { AuthService } from '@src/services/auth';
import { NextFunction, Request, Response } from 'express';

export function authMiddleware(
  request: Partial<Request>,
  response: Partial<Response>,
  next: NextFunction
): void {
  const token = request.headers?.['x-access-token'];

  try {
    const decoded = AuthService.decodeToken(token as string);
    request.decoded = decoded;
    next();
  } catch (err) {
    if (err instanceof Error) {
      response.status?.(401).send({ code: 401, error: err.message });
    } else {
      response.status?.(401).send({ code: 401, error: 'Unknown auth error.' });
    }
  }
}
