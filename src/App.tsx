import React from 'react';
import './App.css';
import fractionAwake from './fractionAwake';
import { DateTime } from 'luxon';
import Twemoji from 'react-twemoji';

function useDate() {
  const [now, setNow] = React.useState(DateTime.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(DateTime.now()), 1000);
    //const timer = setInterval(() => setNow(now.plus({ minutes: 5 })), 50);
    return () => clearInterval(timer);
  });

  return now;
}

function pathToD(path: [number, number][]): string {
  function command(command: string, [x, y]: [number, number]): string {
    return `${command}${x} ${y}`;
  }

  return command("M", path[0]) + " " + path.slice(1).map(c => command("L", c)).join(" ");
}

function App() {
  const now = useDate();

  const percentage = fractionAwake(now) * 100;
  const percentageString = percentage.toLocaleString(undefined, { maximumFractionDigits: 1 });

  // Intentionally more than 24 hours to give slack on left + right
  const hours = Array.from({ length: 27 }, (_, i) => [i, i - 14]);
  const path: [number, number][] = hours.map(([i, h]) => {
    const fraction = fractionAwake(now.plus({ hours: h }));

    // Shift by minutes to make motion smooth
    const x = i * 10 - Math.round(now.minute / 6);
    // Keep a bit of distance from the top and bottom of the SVG
    const y = Math.round((1 - fraction) * 68) + 1;

    return [x, y];
  });

  return (
    <div id="container">
      <div id="percentage">{percentageString}%</div>
      <svg id="graph" viewBox="0 0 240 70">
        <line className="graph-12" x1="1" x2="1" y1="0" y2="70" />
        <line className="graph-6" x1="60" x2="60" y1="0" y2="70" />
        <line className="graph-now" x1="120" x2="120" y1="0" y2="70" />
        <line className="graph-6" x1="180" x2="180" y1="0" y2="70" />
        <line className="graph-12" x1="239" x2="239" y1="0" y2="70" />

        <path className="graph-curve" d={pathToD(path)} />
      </svg>
      <div id="signature">
        <Twemoji noWrapper={true} options={{ className: "emoji" }}><span>💜 🐶</span></Twemoji>
      </div>
    </div>
  );
}

export default App;
