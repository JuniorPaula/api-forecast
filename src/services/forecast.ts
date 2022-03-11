import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

export enum BeachPosition {
  N = 'N',
  S = 'S',
  E = 'E',
  W = 'W',
}

export interface IBeach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface IBeachForecast extends Omit<IBeach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: IBeach[]
  ): Promise<IBeachForecast[]> {
    const poitsWithCorrectSources: IBeachForecast[] = [];
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = points.map((e) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...e,
      }));

      poitsWithCorrectSources.push(...enrichedBeachData);
    }

    return poitsWithCorrectSources;
  }
}
