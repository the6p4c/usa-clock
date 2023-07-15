import { DateTime } from "luxon";
import React from "react";
import { Region } from "../data";
import styles from "./Graph.module.css";

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

export interface GraphProps {
  className: string;

  region: Region;
  now: DateTime;
}

export default function Graph(props: GraphProps) {
  // Height = (odd multiple of 4 + text gap) in order to start and end bars with dash
  const [width, height] = [240, 99];
  const samplesPerHour = 3; // How much subsampling?
  const curvePadding = 1; // Space to leave between top and bottom of graph and curve
  const barX = (i: number) => i * width / 4;
  const barHeight = height - 15;
  const textY = height - 4;

  const [labelsVisible, setLabelsVisible] = React.useState(false);

  // Determine if this is a touch device by using the touchstart event: ignore all mouseenter and
  // mouseleave events if so
  const [isTouch, setIsTouch] = React.useState(false);
  const onMouseEnter = () => {
    if (isTouch) return;
    setLabelsVisible(true);
  };
  const onMouseLeave = () => {
    if (isTouch) return;
    setLabelsVisible(false);
  };
  const onTouchStart = () => {
    setIsTouch(true);
    setLabelsVisible(!labelsVisible);
  };

  const hours = Array.from({ length: 25 * samplesPerHour }, (_, i) => [i / samplesPerHour - 12, i] as const);
  const path = hours.map(([hour, hourIndex]) => {
    const fraction = props.region.fractionAwake(props.now.plus({ hours: hour }));

    const x = (hourIndex / samplesPerHour) * (width / 24);
    const y = (1 - fraction) * (barHeight - 2 * curvePadding) + curvePadding;

    return { x: Math.round(x), y: Math.round(y) };
  });

  return (
    <svg
      className={props.className} viewBox={`0 0 ${width} ${height}`}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
    >
      <line className={styles.bar12} x1={barX(0) + 1} x2={barX(0) + 1} y1={0} y2={barHeight} />
      <line className={styles.bar6} x1={barX(1)} x2={barX(1)} y1={0} y2={barHeight} />
      <line className={styles.barNow} x1={barX(2)} x2={barX(2)} y1={0} y2={barHeight} />
      <line className={styles.bar6} x1={barX(3)} x2={barX(3)} y1={0} y2={barHeight} />
      <line className={styles.bar12} x1={barX(4) - 1} x2={barX(4) - 1} y1={0} y2={barHeight} />

      {labelsVisible ? (<>
        <text className={`${styles.label} ${styles.labelLeft}`} x={barX(0)} y={textY}>-12</text>
        <text className={`${styles.label} ${styles.labelMiddle}`} x={barX(1)} y={textY}>-6</text>
        <text className={`${styles.label} ${styles.labelMiddle}`} x={barX(2)} y={textY}>0</text>
        <text className={`${styles.label} ${styles.labelMiddle}`} x={barX(3)} y={textY}>+6</text>
        <text className={`${styles.label} ${styles.labelRight}`} x={barX(4)} y={textY}>+12</text>
      </>) : null}

      <path className={styles.curve} d={pathToD(path)} />
    </svg>
  );
}

Graph.defaultProps = { className: "" };