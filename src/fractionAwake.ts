import { DateTime } from 'luxon';
import * as raw from './rawData';

// Utility function for reduce
const sum = (a: number, b: number) => a + b;

const fractionAwakeData: number[] = raw.fractionAsleepData.map(f => 1 - f);

// Coalescing raw data into nice objects
type Timezones = [timezone: string, population: number][];

const timezones: Timezones = Object.entries(raw.timezones)
  .map(([timezone, states]) => {
    // Add up populations of all states within this timezone
    let totalPopulation = states
      .map(stateName => raw.populations[stateName])
      .reduce(sum, 0);
    return [timezone, totalPopulation];
  });

const totalPopulation = Object.values(raw.populations).reduce(sum, 0);

function fractionAwakeHour(now: DateTime) {
  const awakePopulation = timezones.map(([timezone, population]) => {
    const timezoneNow = now.setZone(timezone);
    return fractionAwakeData[timezoneNow.hour] * population;
  }).reduce(sum, 0);

  return awakePopulation / totalPopulation;
}

function interp(x: number, p0: {x: number, y: number}, p1: {x: number, y: number}) {
  return (p0.y * (p1.x - x) + p1.y * (x - p0.x)) / (p1.x - p0.x);
}

export default function fractionAwake(now: DateTime) {
  const next = now.plus({ hours: 1 });
  return interp(
    now.minute,
    { x: 0, y: fractionAwakeHour(now) },
    { x: 60, y: fractionAwakeHour(next) }
  );
}
