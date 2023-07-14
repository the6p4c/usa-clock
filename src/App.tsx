import { DateTime } from 'luxon';
import React from 'react';
import Twemoji from 'react-twemoji';
import './App.css';
import fractionAwake from './fractionAwake';
import Graph from './Graph';

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

function App() {
  const now = useDate();
  const [graphVisible, setGraphVisible] = useGraphVisible();

  const percentage = fractionAwake(now) * 100;
  const percentageString = percentage.toLocaleString(undefined, { maximumFractionDigits: 1 });

  return (
    <div id="container" className={graphVisible ? "" : "no-graph"}>
      <div
        id="percentage"
        title={`Approximately ${percentageString}% of Americans currently awake (click to toggle graph)`}
        onClick={() => setGraphVisible(!graphVisible)}
      >
        {percentageString}%
      </div>
      <Graph id="graph" now={now} />
      <div id="signature">
        <Twemoji noWrapper options={{ className: "emoji" }}>
          <span>💜 🐶</span>
        </Twemoji>
      </div>
    </div>
  );
}

export default App;
