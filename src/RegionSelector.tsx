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
  const flags = props.regions.length === 1 ? null : props.regions.map(({id, name, flag}) => {  
    const isSelected = props.id === id;

    return <span
      key={id}
      className={`${styles.flag} ${isSelected ? "" : styles.unselected}`}
      title={isSelected ? `Current region is ${name}` : `Change region to ${name}`}
      onClick={() => props.onChange(id)}
    >
      {flag}{" "}
    </span>;
  });

  return <div className={props.className}>
    <Twemoji noWrapper options={{ className: styles.emoji }}>
      <span>💜 {flags} 🐶</span>
    </Twemoji>
  </div>;
}

RegionSelector.defaultProps = { className: "", onChange: () => {} };
