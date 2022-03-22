import logger from '@src/logger';
import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    response: Response,
    error: unknown
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.hanldeClientErrors(error);
      response
        .status(clientErrors.code)
        .send({ code: clientErrors.code, error: clientErrors.error });
    } else {
      logger.error(error);
      response.status(500).send({ code: 500, error: 'Something went wrong.' });
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
    return { code: 422, error: error.message };
  }
}
