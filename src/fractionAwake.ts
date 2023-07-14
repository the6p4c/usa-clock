import { DateTime } from 'luxon';
import * as raw from './rawData';

// Utility function for reduce
const sum = (a: number, b: number) => a + b;

// Wake and sleep times
type SleepCycle = [hour: number, fraction: number][];

const ungodlyHour = 5;
const sleepCycle = {
  wake: [
    // Must wake between ungodly hours and midnight
    [8, 0.6],
    [9, 0.2],
    [10, 0.1],
    [11, 0.08],
    [12, 0.02]
  ] as SleepCycle,
  sleep: [
    // Must sleep between midnight and ungodly hours
    [0, 0.6],
    [1, 0.2],
    [2, 0.1],
    [3, 0.08],
    [4, 0.02]
  ] as SleepCycle
};

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

    const fraction = (cycle: SleepCycle) => cycle
      .map(([hour, fraction]) => timezoneNow.hour >= hour ? fraction : 0)
      .reduce(sum, 0);
    const fractionAwake = 
      timezoneNow.hour < ungodlyHour ? 1 - fraction(sleepCycle.sleep) : fraction(sleepCycle.wake);

    return fractionAwake * population;
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
