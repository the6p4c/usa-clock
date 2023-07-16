import React from "react";
import Twemoji from "react-twemoji";
import { Region } from "../data";
import styles from "./RegionSelector.module.css";

export interface FlagProps {
  selected: boolean;
  region: Region;

  onClick: () => void;
  onHold: () => void;
}

function Flag(props: FlagProps) {
  const [state, setState] = React.useState<"off" | "waiting" | "triggered">("off");

  const holdDelay = 2000;
  const onHold = props.onHold;
  React.useEffect(() => {
    if (state === "waiting") {
      const timeout = setTimeout(() => {
        setState("triggered");
        onHold();
      }, holdDelay);

      return () => clearTimeout(timeout);
    }
  }, [state, onHold]);

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    // Make sure we receive the pointerup event even if the user moves off of the flag element
    (e.target as HTMLSpanElement).setPointerCapture(e.pointerId);
    setState("waiting");
  };

  const onPointerUp = () => {
    if (state === "waiting") props.onClick();
    setState("off");
  };

  return <span
    className={`${styles.flag} ${props.selected ? "" : styles.unselected}`}
    title={`${props.selected ? "Current region is" : "Change region to"} ${props.region.name}`}
    onPointerDown={onPointerDown} onPointerUp={onPointerUp}
  >
    {props.region.flag}{" "}
  </span>;
}

export interface RegionSelectorProps {
  className: string;

  regions: Region[];
  id: string;
  toastText: string;
  onChange: (id: string) => void;
  onHold: (id: string) => void;
}

export default function RegionSelector(props: RegionSelectorProps) {
  // Fade out class initially unapplied so that page load/refresh doesn't show toast
  const [toastFadeOut, setToastFadeOut] = React.useState(false);
  const toastText = props.toastText;
  React.useEffect(() => {
    // Remove fade out class and re-add to restart animation
    setToastFadeOut(false)
    setTimeout(() => setToastFadeOut(true), 10);
  }, [toastText]);

  const flags = props.regions.length === 1 ? null : props.regions.map(region => {
    return <Flag
      key={region.id}
      selected={props.id === region.id} region={region}
      onClick={() => props.onChange(region.id)} onHold={() => props.onHold(region.id)}
    />;
  });

  return <div className={props.className}>
    <div className={`${styles.toast} ${toastFadeOut ? styles.toastFadeOut : ""}`}>{toastText}</div>
    <Twemoji options={{ className: styles.emoji }}>
      💜 {flags} 🐶
    </Twemoji>
  </div>;
}

RegionSelector.defaultProps = { className: "", onChange: () => {} };
