import React from "react";
import Twemoji from "react-twemoji";
import { Region } from "./data/data";
import styles from "./RegionSelector.module.css";

export interface RegionSelectorProps {
  className: string;

  regions: Region[];
  id: string;
  onChange: (id: string) => void;
}

export default function RegionSelector(props: RegionSelectorProps) {
  const [name, setName] = React.useState("");
  // Fade out class initially unapplied so that page load/refresh doesn't show region name
  const [fadeOut, setFadeOut] = React.useState(false);

  const flags = props.regions.length === 1 ? null : props.regions.map(({id, name, flag}) => {  
    const isSelected = props.id === id;

    const onClick = () => {
      setName(name);

      // Remove fade out class and re-add to restart animation
      setFadeOut(false)
      setTimeout(() => setFadeOut(true), 10);

      props.onChange(id);
    };

    return <span
      key={id}
      className={`${styles.flag} ${isSelected ? "" : styles.unselected}`}
      title={isSelected ? `Current region is ${name}` : `Change region to ${name}`}
      onClick={onClick}
    >
      {flag}{" "}
    </span>;
  });

  return <div className={props.className}>
    <div className={`${styles.name} ${fadeOut ? styles.fadeOut : ""}`}>{name}</div>
    <Twemoji options={{ className: styles.emoji }}>
      💜 {flags} 🐶
    </Twemoji>
  </div>;
}

RegionSelector.defaultProps = { className: "", onChange: () => {} };
