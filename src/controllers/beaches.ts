import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const beach = new Beach({
        ...request.body,
        ...{ user: request.decoded?.id },
      });
      const result = await beach.save();
      response.status(201).send(result);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        response.status(422).send({ error: err.message });
      } else {
        logger.error(err);
        response.status(500).send({ error: 'Internal Server Error.' });
      }
    }
  }
}
