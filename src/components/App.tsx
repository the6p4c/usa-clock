import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faMoon, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import throttle from "lodash.throttle";
import { DateTime } from "luxon";
import React from "react";
import styles from "./App.module.css";
import regions from "../data";
import Graph from "./Graph";
import InfoModal from "./InfoModal";
import RegionSelector from "./RegionSelector";
import Slider from "./Slider";

function useDate() {
  const [now, setNow] = React.useState(DateTime.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(DateTime.now()), 1000);
    //const timer = setInterval(() => setNow(now.plus({ minutes: 15 })), 500);
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

function InfoModalToggle(props: { className: string, onClick: () => void }) {
  return <div
    className={styles.sidebarIcon}
    title="About"
  >
    <FontAwesomeIcon icon={faCircleInfo} onClick={props.onClick} />
  </div>;
}

function ThemeToggle(props: { className: string }) {
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage("isDarkTheme", false);
  React.useEffect(() => {
    // Remember to keep this in sync with similar code in index.html
    const theme = isDarkTheme ? "dark" : "light";
    const themeColor = isDarkTheme ? "#111111" : "#ffffff";

    document.body.dataset.theme = theme;
    (document.querySelector("meta[name='theme-color']") as HTMLMetaElement).content = themeColor;
  }, [isDarkTheme]);

  return <div
    className={`${props.className} ${styles.themeToggle}`}
    title={`Click to change to ${isDarkTheme ? "light mode" : "dark mode"}`}
    onClick={() => setIsDarkTheme(!isDarkTheme)}
  >
    {isDarkTheme ? <FontAwesomeIcon icon={faLightbulb} /> : <FontAwesomeIcon icon={faMoon} />}
  </div>;
}

function Sidebar(props: { onInfoClick: () => void }) {
  return <div className={styles.sidebar}>
    <InfoModalToggle className={styles.sidebarIcon} onClick={props.onInfoClick} />
    <ThemeToggle className={styles.sidebarIcon} />
  </div>;
}

export default function App() {
  const [regionId, setRegionId] = useLocalStorage("regionId", regions[0].id);
  const region = regions.find(({ id, ..._ }) => id === regionId) || regions[0];

  const [timeOffset, setTimeOffset] = React.useState(0);
  const now = useDate().plus({ hours: timeOffset });

  const [extrasVisible, setExtrasVisible] = useLocalStorage("extrasVisible", true);
  const [infoModalVisible, setInfoModalVisible] = React.useState(false);

  const percentage = region.fractionAwake(now) * 100;
  const percentageString = percentage.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return <div className={`${styles.container} ${extrasVisible ? "" : styles.noExtras}`}>
    <div
      className={styles.percentage}
      title={`Approximately ${percentageString}% of ${region.demonym} are currently awake (click to ${extrasVisible ? "hide" : "show" } graph)`}
      onClick={() => setExtrasVisible(!extrasVisible)}
    >
      {percentageString}%
    </div>
    <Graph className={styles.graph} region={region} now={now} />
    <Slider className={styles.slider} onChange={throttle(t => setTimeOffset(t * 24 - 12), 20)} />
    <RegionSelector
      className={styles.regionSelector}
      regions={regions} id={regionId} onChange={id => setRegionId(id)}
    />
    <Sidebar onInfoClick={() => setInfoModalVisible(true)} />
    <InfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
  </div>;
}
