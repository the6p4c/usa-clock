import React from "react";
import Twemoji from "react-twemoji";
import { Region } from "../data";
import styles from "./RegionSelector.module.css";

export interface FlagProps {
  selected: boolean;
  region: Region;

  onClick: () => void;
}

function Flag(props: FlagProps) {
  return <span
    className={`${styles.flag} ${props.selected ? "" : styles.unselected}`}
    title={`${props.selected ? "Current region is" : "Change region to"} ${props.region.name}`}
    onClick={props.onClick}
  >
    {props.region.flag}{" "}
  </span>;
}

export interface RegionSelectorProps {
  className: string;

  regions: Region[];
  id: string;
  onChange: (id: string) => void;
}

export default function RegionSelector(props: RegionSelectorProps) {
  const [toastText, setToastText] = React.useState("");
  // Fade out class initially unapplied so that page load/refresh doesn't show toast
  const [toastFadeOut, setToastFadeOut] = React.useState(false);
  const showToast = (text: string) => {
    setToastText(text);
    // Remove fade out class and re-add to restart animation
    setToastFadeOut(false)
    setTimeout(() => setToastFadeOut(true), 10);
  };

  const flags = props.regions.length === 1 ? null : props.regions.map(region => {
    const onClick = () => {
      showToast(region.name);
      props.onChange(region.id);
    };

    return <Flag key={region.id} selected={props.id === region.id} region={region} onClick={onClick} />;
  });

  return <div className={props.className}>
    <div className={`${styles.toast} ${toastFadeOut ? styles.toastFadeOut : ""}`}>{toastText}</div>
    <Twemoji options={{ className: styles.emoji }}>
      💜 {flags} 🐶
    </Twemoji>
  </div>;
}

RegionSelector.defaultProps = { className: "", onChange: () => {} };
