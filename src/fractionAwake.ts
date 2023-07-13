import { DateTime } from 'luxon';
import * as raw from './rawData';

// Utility function for reduce
const sum: (a: number, b: number) => number = (a, b) => a + b;

interface SleepCycle {
  wake: [number, number][];
  sleep: [number, number][];
}

interface StateData {
  population: number;
  timezone: string;
}

const ungodlyHour = 5;
const sleepCycle: SleepCycle = {
  wake: [
    // Must wake between ungodly hours and midnight
    [8, 0.6],
    [9, 0.2],
    [10, 0.1],
    [11, 0.08],
    [12, 0.02]
  ],
  sleep: [
    // Must sleep between midnight and ungodly hours
    [0, 0.6],
    [1, 0.2],
    [2, 0.1],
    [3, 0.08],
    [4, 0.02]
  ]
};

const data = (() => {
  function resolveTimezone(state: string): string {
    for (const [timezone, states] of Object.entries(raw.timezones)) {
      if (states.includes(state)) {
        return timezone;
      }
    }
  
    throw new Error("could not find timezone for" + state);
  }

  const data: [string, StateData][] = Object.entries(raw.populations)
    .map(([state, population]) => {
      const timezone = resolveTimezone(state);

      return [state, {
        population: population,
        timezone: timezone,
      }];
    });

  return Object.fromEntries(data);
})();

const totalPopulation = Object.values(data).map(s => s.population).reduce(sum, 0);

export default function fractionAwake(now: DateTime): number {
  const awakePopulation = Object.values(data).map(stateData => {
    const stateTime = now.setZone(stateData.timezone);

    const fraction: (cycle: [number, number][]) => number =
      cycle => cycle.map(([hour, fraction]) => stateTime.hour >= hour ? fraction : 0)
        .reduce(sum, 0);
    const fractionAwake = 
      stateTime.hour < ungodlyHour ? 1 - fraction(sleepCycle.sleep) : fraction(sleepCycle.wake);

    return fractionAwake * stateData.population;
  }).reduce(sum, 0);

  return awakePopulation / totalPopulation;
}
