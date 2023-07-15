import { DateTime } from "luxon";

// Imported in same order as included in data array at bottom of file
import dataUS from "./data/dataUS";
import dataAU from "./data/dataAU";
import dataNZ from "./data/dataNZ";

// Utility function for reduce
const sum = (a: number, b: number) => a + b;

interface RegionRawData {
  populations: { [subregion: string]: number; };
  timezones: { [timezone: string]: string[]; };
  fractionAsleepAt: number[];
}

interface RegionData {
  id: string;
  name: string;
  demonym: string;
  flag: string;
  raw: RegionRawData;
}

export class Region {
  readonly id: string;
  readonly name: string;
  readonly demonym: string;
  readonly flag: string;
  private readonly populationPerTimezone: (readonly [string, number])[];
  private readonly fractionAwakeAt: number[];
  private readonly totalPopulation: number;

  constructor(data: RegionData) {
    this.id = data.id;
    this.name = data.name;
    this.demonym = data.demonym;
    this.flag = data.flag;

    const raw = data.raw;

    this.populationPerTimezone = Object.entries(raw.timezones)
      .map(([timezone, subregions]) => {
        let timezonePopulation = subregions
          .map(subregion => raw.populations[subregion])
          .reduce(sum);
        return [timezone, timezonePopulation] as const;
      });
    this.fractionAwakeAt = raw.fractionAsleepAt.map(f => 1 - f);
    this.totalPopulation = Object.values(raw.populations).reduce(sum);
  }

  private fractionAwakeHour(now: DateTime): number {
    const awakePopulation = this.populationPerTimezone
      .map(([timezone, population]) => {
        const timezoneNow = now.setZone(timezone);
        return this.fractionAwakeAt[timezoneNow.hour] * population;
      })
      .reduce(sum);

    return awakePopulation / this.totalPopulation;
  }

  fractionAwake(now: DateTime): number {
    function interp(x: number, p0: {x: number, y: number}, p1: {x: number, y: number}) {
      return (p0.y * (p1.x - x) + p1.y * (x - p0.x)) / (p1.x - p0.x);
    }

    const next = now.plus({ hours: 1 });
    return interp(
      now.minute,
      { x: 0, y: this.fractionAwakeHour(now) },
      { x: 60, y: this.fractionAwakeHour(next) }
    );
  }
}

const data = [
  { id: "us", name: "USA", demonym: "Americans", flag: "🇺🇸", raw: dataUS },
  { id: "au", name: "Australia", demonym: "Australians", flag: "🇦🇺", raw: dataAU },
  { id: "nz", name: "New Zealand", demonym: "Kiwis", flag: "🇳🇿", raw: dataNZ }, // TODO: fractionAsleepAt
].map(data => new Region(data));

export default data;
