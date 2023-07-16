import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import styles from "./InfoModal.module.css";

export interface InfoModalProps {
  className: string;

  visible: boolean;
  onClose: () => void;
}

export default function InfoModal(props: InfoModalProps) {
  return <div
      className={`${props.className} ${styles.infoModal} ${props.visible ? styles.visible : ""}`}
  >
    <div className={styles.container}>
      <h1>USA Clock</h1>
      <p>
        Idea shamelessly stolen from <a href="https://www.yusuf.fyi/">Yusuf Bouzekri</a>, whose <a href="https://are-the-americans-awake.yusuf.fyi/">"Are the Americans Awake?"</a> clock prompted this re-build and expansion of the concept. Comparatively, this version includes Alaska, Hawaii, and Puerto Rico, and various other countries.
      </p>
      <p>
        Source available on <a href="https://github.com/the6p4c/usa-clock">GitHub</a>.
      </p>

      <h1>Data sources</h1>
      <h2>America</h2>
      <p>
        Population data sourced from the <a href="https://data.census.gov/table?q=est2022-pop&tid=DECENNIALDHC2020.P1">United States Census Bureau</a>; timezones collated from <a href="https://www.nationsonline.org/oneworld/map/US-timezone_map.htm">"Nations Online"</a> and <a href="http://efele.net/maps/tz/us/">efele.net</a>; sleep schedule data collated from the <a href="https://beta.bls.gov/dataViewer/view/timeseries/TUU30105AA01051617">Bureau of Labor Statistics</a>.
      </p>

      <h2>Australia</h2>
      <p>
        Population data sourced from the <a href="https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release">Australian Bureau of Statistics</a>; timezones collated from <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">Wikipedia</a>; sleep schedule data collated from the <a href="https://www.abs.gov.au/statistics/people/people-and-communities/how-australians-use-their-time/latest-release">Australian Bureau of Statistics</a>.
      </p>

      <h2>New Zealand</h2>
      <p>
        Population data unneeded (single timezone); timezone is just <code>Pacific/Auckland</code>; sleep schedule presently based on Australia.
      </p>
    </div>
    <FontAwesomeIcon
      className={styles.close}
      title="Click to close"
      icon={faX}
      onClick={props.onClose}
    />
  </div>;
}

InfoModal.defaultProps = { className: "", onClose: () => {} };
