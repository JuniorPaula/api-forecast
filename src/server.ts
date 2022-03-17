import './utils/module-alias';
import express from 'express';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express-serve-static-core';
import * as database from '@src/database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesContoller = new BeachesController();
    const userController = new UsersController();
    this.addControllers([forecastController, beachesContoller, userController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`[+] Server listening on port: ${this.port}`);
    });
  }
}
