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
interface State {
  name: string;
  population: number;
  timezone: string;
}

const states: State[] = (() => {
  function resolveTimezone(state: string) {
    for (const [timezone, states] of Object.entries(raw.timezones)) {
      if (states.includes(state)) {
        return timezone;
      }
    }
  
    throw new Error(`could not find timezone for ${state}`);
  }

  return Object.entries(raw.populations)
    .map(([name, population]) => {
      const timezone = resolveTimezone(name);
      return { name, population, timezone };
    });
})();

const totalPopulation = Object.values(states).map(s => s.population).reduce(sum, 0);

export default function fractionAwake(now: DateTime) {
  const awakePopulation = states.map(state => {
    const stateTime = now.setZone(state.timezone);

    const fraction = (cycle: SleepCycle) =>
      cycle.map(([hour, fraction]) => stateTime.hour >= hour ? fraction : 0)
        .reduce(sum, 0);
    const fractionAwake = 
      stateTime.hour < ungodlyHour ? 1 - fraction(sleepCycle.sleep) : fraction(sleepCycle.wake);

    return fractionAwake * state.population;
  }).reduce(sum, 0);

  return awakePopulation / totalPopulation;
}
