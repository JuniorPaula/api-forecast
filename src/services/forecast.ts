import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { IBeach } from '@src/models/beach';
import { InternalError } from '@src/utils/errors/internal-error';

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
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: IBeach[]
  ): Promise<ITimeForecast[]> {
    const poitsWithCorrectSources: IBeachForecast[] = [];
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);

        poitsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(poitsWithCorrectSources);
    } catch (error) {
      throw new IForecastProcessingInternalError((error as Error).message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: IBeach
  ): IBeachForecast[] {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
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
