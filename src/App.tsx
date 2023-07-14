import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faLightbulb } from '@fortawesome/free-solid-svg-icons';
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

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = React.useState(() => {
    const value = localStorage.getItem(key);
    if (value != null) {
      return JSON.parse(value) as T;
    } else {
      return defaultValue;
    }
  });

  React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);

  return [value, setValue] as const;
}

export default function App() {
  const now = useDate();
  const [isDarkMode, setIsDarkMode] = useLocalStorage("isDarkMode", false);
  const [graphVisible, setGraphVisible] = useLocalStorage("graphVisible", true);

  const percentage = fractionAwake(now) * 100;
  const percentageString = percentage.toLocaleString(undefined, { maximumFractionDigits: 0 });

  React.useEffect(() => {
    const themeColor = isDarkMode ? "#111111" : "#ffffff";

    document.body.classList.toggle("dark-mode", isDarkMode);
    (document.querySelector("meta[name='theme-color']") as any).content = themeColor;
  }, [isDarkMode]);

  return (
    <>
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
      <div
        id="skin-toggle"
        title={`Click to change to ${isDarkMode ? "light mode" : "dark mode"}`}
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? <FontAwesomeIcon icon={faLightbulb} /> : <FontAwesomeIcon icon={faMoon} />}
      </div>
    </>
  );
}
