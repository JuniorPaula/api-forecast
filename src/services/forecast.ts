import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import logger from '@src/logger';
import { IBeach } from '@src/models/beach';
import { InternalError } from '@src/utils/errors/internal-error';
import { Rating } from './Rating';

export interface IBeachForecast extends Omit<IBeach, 'user'>, ForecastPoint {}

export interface ITimeForecast {
  time: string;
  forecast: IBeachForecast[];
}

export class IForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexperted error during forecast process request: ${message}`);
  }
}

export class Forecast {
  constructor(
    protected stormGlass = new StormGlass(),
    protected RatingService: typeof Rating = Rating
  ) {}

  public async processForecastForBeaches(
    beaches: IBeach[]
  ): Promise<ITimeForecast[]> {
    const poitsWithCorrectSources: IBeachForecast[] = [];
    logger.info(`Prepering the forecast for ${beaches.length} beaches`);
    try {
      for (const beach of beaches) {
        const rating = new this.RatingService(beach);
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach, rating);

        poitsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(poitsWithCorrectSources);
    } catch (error) {
      logger.error(error);
      throw new IForecastProcessingInternalError((error as Error).message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: IBeach,
    rating: Rating
  ): IBeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRatingForPoint(point),
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: IBeachForecast[]): ITimeForecast[] {
    const forecastByTime: ITimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
