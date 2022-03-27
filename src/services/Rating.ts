import { BeachPosition, IBeach } from '@src/models/beach';

const wavesHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: IBeach) {}

  public getRatingBasedOnWindAndWavePositions(
    wavePosition: BeachPosition,
    windPosition: BeachPosition
  ): number {
    if (wavePosition === windPosition) {
      return 1;
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5;
    }
    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }
    if (period >= 10 && period < 14) {
      return 4;
    }
    if (period >= 14) {
      return 5;
    }
    return 1;
  }

  public getRatingForSwellSize(height: number): number {
    if (
      height >= wavesHeights.ankleToKnee.min &&
      height < wavesHeights.ankleToKnee.max
    ) {
      return 2;
    }

    if (
      height >= wavesHeights.waistHigh.min &&
      height < wavesHeights.waistHigh.max
    ) {
      return 3;
    }

    if (height >= wavesHeights.headHigh.min) {
      return 5;
    }

    return 1;
  }

  public getPositionFromLocation(coordinate: number): BeachPosition {
    if (coordinate >= 310 || (coordinate < 50 && coordinate >= 0)) {
      return BeachPosition.N;
    }
    if (coordinate >= 50 && coordinate < 120) {
      return BeachPosition.E;
    }
    if (coordinate >= 120 && coordinate < 220) {
      return BeachPosition.S;
    }
    if (coordinate >= 220 && coordinate < 310) {
      return BeachPosition.W;
    }

    return BeachPosition.E;
  }

  private isWindOffShore(
    wavePosition: BeachPosition,
    windPosition: BeachPosition
  ): boolean {
    return (
      (wavePosition === BeachPosition.N &&
        windPosition === BeachPosition.S &&
        this.beach.position === BeachPosition.N) ||
      (wavePosition === BeachPosition.S &&
        windPosition === BeachPosition.N &&
        this.beach.position === BeachPosition.S) ||
      (wavePosition === BeachPosition.E &&
        windPosition === BeachPosition.W &&
        this.beach.position === BeachPosition.E) ||
      (wavePosition === BeachPosition.W &&
        windPosition === BeachPosition.E &&
        this.beach.position === BeachPosition.W)
    );
  }
}
