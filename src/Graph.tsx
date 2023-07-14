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
  const width = 240;
  const height = 99; // = (odd multiple of 4 + text gap) in order to start and end bars with dash

  const samplesPerHour = 3; // How much subsampling?
  const curvePadding = 1; // Space to leave between top and bottom of graph and curve

  const barX = (i: number) => i * width / 4;
  const barHeight = height - 15;
  const textY = height - 4;

  const hours = Array.from({ length: 25 * samplesPerHour }, (_, i) => [i / samplesPerHour - 12, i] as const);
  const path = hours.map(([hour, hourIndex]) => {
    const fraction = fractionAwake(props.now.plus({ hours: hour }));

    const x = (hourIndex / samplesPerHour) * (width / 24);
    const y = (1 - fraction) * (barHeight - 2 * curvePadding) + curvePadding;

    return { x: Math.round(x), y: Math.round(y) };
  });

  // If we get a touchstart event, mark this as a touch device and ignore mousedown/mouseup events
  // so we don't get multiple events for essentially the same thing
  const [isTouch, setIsTouch] = React.useState(false);
  const [textVisible, setTextVisible] = React.useState(false);

  const onMouseDown = () => {
    if (isTouch) return;
    setTextVisible(true);
  };
  const onMouseUp = () => {
    if (isTouch) return;
    setTextVisible(false);
  };
  const onTouchStart = () => {
    setIsTouch(true);
    setTextVisible(!textVisible);
  };

  return (
    <svg
      id={props.id} viewBox={`0 0 ${width} ${height}`}
      onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchStart={onTouchStart}
    >
      <line className="graph-12" x1={barX(0) + 1} x2={barX(0) + 1 } y1={0} y2={barHeight} />
      <line className="graph-6" x1={barX(1)} x2={barX(1)} y1={0} y2={barHeight} />
      <line className="graph-now" x1={barX(2)} x2={barX(2)} y1={0} y2={barHeight} />
      <line className="graph-6" x1={barX(3)} x2={barX(3)} y1={0} y2={barHeight} />
      <line className="graph-12" x1={barX(4) - 1} x2={barX(4) - 1} y1={0} y2={barHeight} />

      {textVisible ? (<>
        <text className="graph-text graph-text-left" x={barX(0) + 1} y={textY}>-12</text>
        <text className="graph-text graph-text-middle" x={barX(1)} y={textY}>-6</text>
        <text className="graph-text graph-text-middle" x={barX(2)} y={textY}>0</text>
        <text className="graph-text graph-text-middle" x={barX(3)} y={textY}>+6</text>
        <text className="graph-text graph-text-right" x={barX(4)} y={textY}>+12</text>
      </>) : null}

      <path className="graph-curve" d={pathToD(path)} />
    </svg>
  );
}
