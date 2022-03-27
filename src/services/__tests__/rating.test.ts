import { GeoPosition, IBeach } from '@src/models/beach';
import { Rating } from '../Rating';

describe('Rating services', () => {
  const defaultBeach: IBeach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: GeoPosition.E,
    user: 'some-user',
  };

  const defaultRating = new Rating(defaultBeach);

  describe('Calculate rating for a give point', () => {
    const defaultPoints = {
      swellDirection: 110,
      swellHeight: 0.1,
      swellPeriod: 5,
      time: 'test',
      waveDirection: 110,
      waveHeight: 0.1,
      windDirection: 100,
      windSpeed: 100,
    };

    it('Should get a rating less than 1 for a poor point', () => {
      const rating = defaultRating.getRatingForPoint(defaultPoints);
      expect(rating).toBe(1);
    });

    it('Should get a rating of 1 for an ok point', () => {
      const pointData = {
        swellHeight: 0.4,
      };
      // using spread operator for cloning object s instead of Object.assign
      const points = { ...defaultPoints, ...pointData };

      const rating = defaultRating.getRatingForPoint(points);
      expect(rating).toBe(1);
    });

    it('Should get a rating of 3 for a point with offshore winds and a half overhead height', () => {
      const points = {
        ...defaultPoints,
        ...{
          swellHeight: 0.7,
          windDirection: 250,
        },
      };

      const rating = defaultRating.getRatingForPoint(points);
      expect(rating).toBe(3);
    });

    it('Should get a rating of 4 for a point with offshore winds, half overhead high swell and good interval', () => {
      const points = {
        ...defaultPoints,
        ...{
          swellHeight: 0.7,
          swellPeriod: 12,
          windDirection: 250,
        },
      };

      const rating = defaultRating.getRatingForPoint(points);
      expect(rating).toBe(4);
    });

    it('Should get a rating of 4 for a point with offshore winds, shoulder high swell and good interval', () => {
      const points = {
        ...defaultPoints,
        ...{
          swellHeight: 1.5,
          swellPeriod: 12,
          windDirection: 250,
        },
      };

      const rating = defaultRating.getRatingForPoint(points);
      expect(rating).toBe(4);
    });

    it('Should get a rating of 5 class day!', () => {
      const points = {
        ...defaultPoints,
        ...{
          swellHeight: 2.5,
          swellPeriod: 16,
          windDirection: 250,
        },
      };

      const rating = defaultRating.getRatingForPoint(points);
      expect(rating).toBe(5);
    });

    it('Should get a rating of 4 a good condition but with crossshore winds', () => {
      const points = {
        ...defaultPoints,
        ...{
          swellHeight: 2.5,
          swellPeriod: 16,
          windDirection: 130,
        },
      };

      const rating = defaultRating.getRatingForPoint(points);
      expect(rating).toBe(4);
    });
  });

  /**
   * Waves and Winds tests
   */
  describe('Get rating based on wind and wave positions', () => {
    it('Should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.E
      );

      expect(rating).toBe(1);
    });

    it('Should get rating 3 for a beach with cross winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.S
      );

      expect(rating).toBe(3);
    });

    it('Should get rating 5 for a beach with offshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.W
      );

      expect(rating).toBe(5);
    });
  });

  /**
   * Period calculation only tests
   */
  describe('Get rating based on swell period', () => {
    it('Should get a rating of 1 for a period of 5 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(5);
      expect(rating).toBe(1);
    });

    it('Should get a rating of 2 for a period of 9 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(9);
      expect(rating).toBe(2);
    });

    it('Should get a rating of 4 for a period of 12 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(12);
      expect(rating).toBe(4);
    });

    it('Should get a rating of 5 for a period of 16 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(16);
      expect(rating).toBe(5);
    });
  });

  /**
   * Swell height specific logic calculation
   */
  describe('Get rating based on swell height', () => {
    it('Should get rating 1 for less than ankle to knee high swell', () => {
      const rating = defaultRating.getRatingForSwellSize(0.2);
      expect(rating).toBe(1);
    });
    it('Should get rating 2 for an ankle to knee high swell', () => {
      const rating = defaultRating.getRatingForSwellSize(0.6);
      expect(rating).toBe(2);
    });

    it('Should get rating 3 for waist high swell', () => {
      const rating = defaultRating.getRatingForSwellSize(1.5);
      expect(rating).toBe(3);
    });

    it('Should get rating 5 for overhead swell', () => {
      const rating = defaultRating.getRatingForSwellSize(2.5);
      expect(rating).toBe(5);
    });
  });

  /**
   * Location specific calculation
   */
  describe('Get Position based on points location', () => {
    it('Should get the point based on a east location', () => {
      const response = defaultRating.getPositionFromLocation(92);
      expect(response).toBe(GeoPosition.E);
    });

    it('Should get the point based on a north location 1', () => {
      const response = defaultRating.getPositionFromLocation(360);
      expect(response).toBe(GeoPosition.N);
    });

    it('Should get the point based on a north location 2', () => {
      const response = defaultRating.getPositionFromLocation(40);
      expect(response).toBe(GeoPosition.N);
    });

    it('Should get the point based on a south location', () => {
      const response = defaultRating.getPositionFromLocation(200);
      expect(response).toBe(GeoPosition.S);
    });

    it('Should get the point based on a west location', () => {
      const response = defaultRating.getPositionFromLocation(300);
      expect(response).toBe(GeoPosition.W);
    });
  });
});
