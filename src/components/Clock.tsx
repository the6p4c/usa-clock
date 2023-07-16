import throttle from "lodash.throttle";
import { DateTime } from "luxon";
import React from "react";
import styles from "./Clock.module.css";
import { Region } from "../data";
import Graph from "./Graph";
import Slider from "./Slider";
import useLocalStorage from "../useLocalStorage";

function useDate() {
  const [now, setNow] = React.useState(DateTime.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(DateTime.now()), 1000);
    //const timer = setInterval(() => setNow(now.plus({ minutes: 15 })), 500);
    return () => clearInterval(timer);
  });

  return now;
}

interface ClockProps {
  className: string;

  region: Region;
}

export default function Clock(props: ClockProps) {
  const [timeOffset, setTimeOffset] = React.useState(0);
  const now = useDate().plus({ hours: timeOffset });

  const [extrasVisible, setExtrasVisible] = useLocalStorage("extrasVisible", true);

  const percentage = props.region.fractionAwake(now) * 100;
  const percentageString = percentage.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return <div className={`${props.className} ${extrasVisible ? "" : styles.noExtras}`}>
    <div
      className={styles.percentage}
      title={`Approximately ${percentageString}% of ${props.region.demonym} are currently awake (click to ${extrasVisible ? "hide" : "show" } graph)`}
      onClick={() => setExtrasVisible(!extrasVisible)}
    >
      {percentageString}%
    </div>
    <Graph className={styles.graph} region={props.region} now={now} />
    <Slider className={styles.slider} onChange={throttle(t => setTimeOffset(t * 24 - 12), 20)} />
  </div>;
}

Clock.defaultProps = { className: "" };
