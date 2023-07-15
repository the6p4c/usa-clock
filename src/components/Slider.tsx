import React from "react";
import styles from "./Slider.module.css";

export interface SliderProps {
  className: string;
  onChange: (t: number) => void;
}

export default function Slider(props: SliderProps) {
  const [width, height] = [240, 20];
  const touchTargetWidth = 20;
  const defaultX = width / 2;
  const gapX = 10;
  const [minX, maxX] = [gapX, width - gapX];

  const dot = React.useRef(null);
  const [x, setXRaw] = React.useState(defaultX);
  const setX = (x: number) => {
    if (x < minX) {
      setXRaw(minX);
    } else if (x > maxX) {
      setXRaw(maxX);
    } else {
      setXRaw(x);
    }
  };

  React.useEffect(() => props.onChange((x - minX) / (maxX - minX)), [props, x, minX, maxX]);

  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = (pointerId: number, x: number) => {
    if (dot.current === null) return;

    // Make sure we receive our events no matter if the user moves the cursor off of the dot, or if
    // the drag was started on the touch target
    (dot.current as SVGCircleElement).setPointerCapture(pointerId);
    setIsDragging(true);
    setX(x);
  };
  const drag = (x: number) => {
    if (!isDragging) return;
    setX(x);
  };
  const dragEnd = () => {
    setIsDragging(false);
    setX(defaultX);
  };

  return <svg
    className={`${props.className} ${isDragging ? styles.dragging : ""}`}
    viewBox={`0 0 ${width} ${height}`}
  >
    <line className={styles.bar} x1={2} y1={height / 2} x2={width - 2} y2={height / 2} />
    <rect
      className={styles.touchTarget}
      x={(width - touchTargetWidth) / 2} y={0} width={touchTargetWidth} height={height}
      onPointerDown={e => dragStart(e.pointerId, e.nativeEvent.offsetX)}
    />
    <circle
      ref={dot}
      className={styles.dot} cx={x} cy={height / 2} r={5}
      onPointerDown={e => dragStart(e.pointerId, e.nativeEvent.offsetX)}
      onPointerMove={e => drag(e.nativeEvent.offsetX)}
      onPointerUp={dragEnd}
    >
      <title>Click, drag, and hold to view with time shift</title>
    </circle>
  </svg>;
}

Slider.defaultProps = { className: "", onDrag: (t: number) => {} };
