import React from 'react';

export default function Slider(props: { onDrag: (t: number) => void }) {
  const [width, height] = [240, 20];
  const defaultX = width / 2;
  const gapX = 10;
  const [minX, maxX] = [gapX, width - gapX];

  const [isDragging, setIsDragging] = React.useState(false);
  const [x, setX] = React.useState(defaultX);

  React.useEffect(() => props.onDrag((x - minX) / (maxX - minX)), [props, x, minX, maxX]);

  const onPointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    // Make sure we receive the pointerup event no matter if the user moves the cursor off of the
    // circle
    (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!isDragging) return;

    const x = e.nativeEvent.offsetX;
    if (x < minX) {
      setX(minX);
    } else if (x > maxX) {
      setX(maxX);
    } else {
      setX(x);
    }
  };

  const onPointerUp = () => {
    setIsDragging(false);
    setX(defaultX);
  };

  return <svg
    id="slider" className={isDragging ? "slider-dragging": ""}
    viewBox={`0 0 ${width} ${height}`}
  >
    <line className="slider-bar" x1={2} y1={height / 2} x2={width - 2} y2={height / 2} />
    <circle
      className="slider-dot" cx={x} cy={height / 2} r={5}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
    />
  </svg>;
}
