import { DateTime } from 'luxon';
import React from 'react';
import Twemoji from 'react-twemoji';
import './App.css';
import fractionAwake from './fractionAwake';

function useDate() {
  const [now, setNow] = React.useState(DateTime.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(DateTime.now()), 1000);
    //const timer = setInterval(() => setNow(now.plus({ minutes: 5 })), 50);
    return () => clearInterval(timer);
  });

  return now;
}

function useGraphVisible() {
  const key = "graphVisible";

  const [graphVisible, setGraphVisible] = React.useState(() => {
    const graphVisible = localStorage.getItem(key);
    // Show the graph by default on first visit
    return graphVisible == null ? true : graphVisible === "true";
  });

  React.useEffect(() => localStorage.setItem(key, "" + graphVisible), [graphVisible]);

  return [graphVisible, setGraphVisible] as const;
}

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

function App() {
  const now = useDate();
  const [graphVisible, setGraphVisible] = useGraphVisible();

  const percentage = fractionAwake(now) * 100;
  const percentageString = percentage.toLocaleString(undefined, { maximumFractionDigits: 1 });

  // Need 25 hours to fill entire graph + 26th hour to give slack for shifting by minutes
  const hours = Array.from({ length: 26 }, (_, i) => [i - 12, i] as const);
  const path = hours.map(([h, xi]) => {
    const fraction = fractionAwake(now.plus({ hours: h }));

    // Shift by minutes to make motion smooth
    const x = xi * 10 - Math.round(now.minute / 6);
    // Keep a bit of distance from the top and bottom of the SVG
    const y = Math.round((1 - fraction) * 68) + 1;

    return { x, y };
  });

  return (
    <div id="container" className={graphVisible ? "" : "no-graph"}>
      <div
        id="percentage"
        title={`Approximately ${percentageString}% of Americans currently awake (click to toggle graph)`}
        onClick={() => setGraphVisible(!graphVisible)}
      >
        {percentageString}%
      </div>
      <svg id="graph" viewBox="0 0 240 70">
        <line className="graph-12" x1="1" x2="1" y1="0" y2="70" />
        <line className="graph-6" x1="60" x2="60" y1="0" y2="70" />
        <line className="graph-now" x1="120" x2="120" y1="0" y2="70" />
        <line className="graph-6" x1="180" x2="180" y1="0" y2="70" />
        <line className="graph-12" x1="239" x2="239" y1="0" y2="70" />

        <path className="graph-curve" d={pathToD(path)} />
      </svg>
      <div id="signature">
        <Twemoji noWrapper options={{ className: "emoji" }}>
          <span>💜 🐶</span>
        </Twemoji>
      </div>
    </div>
  );
}

export default App;
