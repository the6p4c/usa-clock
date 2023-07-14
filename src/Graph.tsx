import { DateTime } from 'luxon';
import React from 'react';
import fractionAwake from './fractionAwake';

interface Coord {
  x: number;
  y: number;
}

function pathToD(path: Coord[]) {
  function command(command: string, {x, y}: Coord) {
    return `${command}${x} ${y}`;
  }

  return [
    command("M", path[0]),
    ...path.slice(1).map(c => command("L", c)),
  ].join(" ");
}

export default function Graph(props: { id: string, now: DateTime }) {
  // Need 25 hours to fill entire graph + 26th hour to give slack for shifting by minutes
  const hours = Array.from({ length: 26 }, (_, i) => [i - 12, i] as const);
  const path = hours.map(([h, xi]) => {
    const fraction = fractionAwake(props.now.plus({ hours: h }));

    // Shift by minutes to make motion smooth
    const x = xi * 10 - Math.round(props.now.minute / 6);
    // Keep a bit of distance from the top and bottom of the SVG
    const y = Math.round((1 - fraction) * 68) + 1;

    return { x, y };
  });

  return (
    <svg id={props.id} viewBox="0 0 240 70">
      <line className="graph-12" x1="1" x2="1" y1="0" y2="70" />
      <line className="graph-6" x1="60" x2="60" y1="0" y2="70" />
      <line className="graph-now" x1="120" x2="120" y1="0" y2="70" />
      <line className="graph-6" x1="180" x2="180" y1="0" y2="70" />
      <line className="graph-12" x1="239" x2="239" y1="0" y2="70" />

      <path className="graph-curve" d={pathToD(path)} />
    </svg>
  );
}
