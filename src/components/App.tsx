import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faMoon, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styles from "./App.module.css";
import Clock from "./Clock";
import regions from "../data";
import InfoModal from "./InfoModal";
import RegionSelector from "./RegionSelector";
import useLocalStorage from "../useLocalStorage";

function InfoModalToggle(props: { className: string, onClick: () => void }) {
  return <div
    className={styles.sidebarIcon}
    title="About"
  >
    <FontAwesomeIcon icon={faCircleInfo} onClick={props.onClick} />
  </div>;
}

function ThemeToggle(props: { className: string }) {
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage("isDarkTheme", false);
  React.useEffect(() => {
    // Remember to keep this in sync with similar code in index.html
    const theme = isDarkTheme ? "dark" : "light";
    const themeColor = isDarkTheme ? "#111111" : "#ffffff";

    document.body.dataset.theme = theme;
    (document.querySelector("meta[name='theme-color']") as HTMLMetaElement).content = themeColor;
  }, [isDarkTheme]);

  return <div
    className={`${props.className} ${styles.themeToggle}`}
    title={`Click to change to ${isDarkTheme ? "light mode" : "dark mode"}`}
    onClick={() => setIsDarkTheme(!isDarkTheme)}
  >
    {isDarkTheme ? <FontAwesomeIcon icon={faLightbulb} /> : <FontAwesomeIcon icon={faMoon} />}
  </div>;
}

function Sidebar(props: { onInfoClick: () => void }) {
  return <div className={styles.sidebar}>
    <InfoModalToggle className={styles.sidebarIcon} onClick={props.onInfoClick} />
    <ThemeToggle className={styles.sidebarIcon} />
  </div>;
}

export default function App(props: { defaultRegionId: string | null }) {
  const [regionId, setRegionId] = useLocalStorage("regionId", regions[0].id, () => {
    if (regions.find(({ id, ..._ }) => id === props.defaultRegionId)) {
      return props.defaultRegionId;
    } else {
      return null;
    }
  });
  const region = regions.find(({ id, ..._ }) => id === regionId) || regions[0];

  const [infoModalVisible, setInfoModalVisible] = React.useState(false);

  return <div className={styles.container}>
    <Clock className={styles.clock} region={region} />
    <RegionSelector
      className={styles.regionSelector}
      regions={regions} id={regionId} onChange={id => setRegionId(id)}
    />
    <Sidebar onInfoClick={() => setInfoModalVisible(true)} />
    <InfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
  </div>;
}
