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

  fractionAwake(now: DateTime): number {
    const awakePopulation = this.populationPerTimezone
      .map(([timezone, population]) => {
        const timezoneNow = now.setZone(timezone);
        return this.fractionAwakeAt[timezoneNow.hour] * population;
      })
      .reduce(sum);

    return awakePopulation / this.totalPopulation;
  }
}

class Regions extends Array<Region> {
  static fromArray(items: Region[]) {
    const regions = new Regions();
    regions.push(...items);
    return regions;
  }

  getRegionById(id: string) {
    const wantedId = id;
    const region = this.find(({ id, ..._ }) => id === wantedId);
    if (region) {
      return region;
    } else {
      throw new Error(`could not find region with id ${id}`);
    }
  }

  getRegionByIdOrNull(id: string) {
    const wantedId = id;
    const region = this.find(({ id, ..._ }) => id === wantedId);
    if (region) {
      return region;
    } else {
      return null;
    }
  }
}

const data = Regions.fromArray([
  { id: "us", name: "America", demonym: "Americans", flag: "🇺🇸", raw: dataUS },
  { id: "au", name: "Australia", demonym: "Australians", flag: "🇦🇺", raw: dataAU },
  { id: "nz", name: "New Zealand", demonym: "Kiwis", flag: "🇳🇿", raw: dataNZ }, // TODO: fractionAsleepAt
].map(data => new Region(data)));

export default data;
