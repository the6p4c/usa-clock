import { DateTime } from "luxon";
import React from "react";
import { Region } from "../data";
import styles from "./Graph.module.css";

interface Coord {
  x: number;
  y: number;
}

function pathToD(path: Coord[]) {
  function round(v: number): string {
    return v.toLocaleString(undefined, { maximumFractionDigits: 3 });
  }

  function command(command: string, {x, y}: Coord) {
    return `${command}${round(x)} ${round(y)}`;
  }

  return [
    command("M", path[0]),
    ...path.slice(1).map(c => command("L", c)),
  ].join(" ");
}

function smoothPath(p0: Coord, p1: Coord, path: Coord[]): Coord[] {
  const pointsPerSpline = 5;

  const tangentPath = [p0, ...path, p1];
  const m = tangentPath.slice(0, -2)
    .map((p0, i) => {
      const p2 = tangentPath[i + 2];

      const x = (p2.x - p0.x) / 2;
      const y = (p2.y - p0.y) / 2;

      return { x, y };
    });

  return path.slice(0, -1)
    .map((p0, i) => {
      const [m0, m1] = [m[i], m[i + 1]];
      const p1 = path[i + 1];

      return Array.from({ length: pointsPerSpline }, (_, i) => i / pointsPerSpline)
        .map(t => {
          const t3 = t*t*t;
          const t2 = t*t;

          const h00 = 2*t3 - 3*t2 + 1;
          const h10 = t3 - 2*t2 + t;
          const h01 = -2*t3 + 3*t2;
          const h11 = t3 - t2;

          const x = h00*p0.x + h10*m0.x + h01*p1.x + h11*m1.x;
          const y = h00*p0.y + h10*m0.y + h01*p1.y + h11*m1.y;

          return { x, y };
        });
    })
    .reduce((path, spline) => [...path, ...spline], []);
}

export interface GraphProps {
  className: string;

  region: Region;
  now: DateTime;
}

export default function Graph(props: GraphProps) {
  // Height = (odd multiple of 4 + text gap) in order to start and end bars with dash
  const [width, height] = [240, 99];
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

  // Generates [-13..15, -1..27]
  // We need two hours left of 0 and right of 24 so that we have one point to determining the slope,
  // plus one point so that the curve always appears to continue off the edge of the graph - a total
  // of 25 + 2 + 2 = 29 hours.
  const hours = Array.from({ length: 29 }, (_, i) => [i - 13, i - 1] as const);
  const fullPath = hours.map(([hour, hourIndex]) => {
    const now = props.now.plus({ hours: hour });
    const fraction = props.region.fractionAwake(now);

    const x = (hourIndex - now.minute / 60) * (width / 24);
    const y = (1 - fraction) * (barHeight - 2 * curvePadding) + curvePadding;

    return { x, y };
  });

  const [p0, p1] = [fullPath[0], fullPath[fullPath.length - 1]];
  const path = fullPath.slice(1, -1);
  const d = pathToD(smoothPath(p0, p1, path));

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

      <path className={styles.curve} d={d} />
    </svg>
  );
}

Graph.defaultProps = { className: "" };
