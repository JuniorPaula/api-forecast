import logger from '@src/logger';
import { CUSTOM_VALIDATION } from '@src/models/user';
import APIError, { IApiError } from '@src/utils/errors/api-error';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    response: Response,
    error: unknown
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.hanldeClientErrors(error);
      response.status(clientErrors.code).send(
        APIError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        })
      );
    } else {
      logger.error(error);
      response
        .status(500)
        .send(APIError.format({ code: 500, message: 'Something went wrong.' }));
    }
  }

  private hanldeClientErrors(error: mongoose.Error.ValidationError): {
    code: number;
    error: string;
  } {
    const duplicatedKindError = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );
    if (duplicatedKindError.length) {
      return { code: 409, error: error.message };
    }
    return { code: 400, error: error.message };
  }

  protected sendErrorResponse(
    response: Response,
    apiError: IApiError
  ): Response {
    return response.status(apiError.code).send(APIError.format(apiError));
  }
}
