// United States Census Bureau data
// https://data.census.gov/table?q=est2022-pop&tid=DECENNIALDHC2020.P1
export const populations: { [keys: string]: number; } = {
  "Alabama": 5024279,
  "Alaska": 733391,
  "Arizona": 7151502,
  "Arkansas": 3011524,
  "California": 39538223,
  "Colorado": 5773714,
  "Connecticut": 3605944,
  "Delaware": 989948,
  "District of Columbia": 689545,
  "Florida": 21538187,
  "Georgia": 10711908,
  "Hawaii": 1455271,
  "Idaho": 1839106,
  "Illinois": 12812508,
  "Indiana": 6785528,
  "Iowa": 3190369,
  "Kansas": 2937880,
  "Kentucky": 4505836,
  "Louisiana": 4657757,
  "Maine": 1362359,
  "Maryland": 6177224,
  "Massachusetts": 7029917,
  "Michigan": 10077331,
  "Minnesota": 5706494,
  "Mississippi": 2961279,
  "Missouri": 6154913,
  "Montana": 1084225,
  "Nebraska": 1961504,
  "Nevada": 3104614,
  "New Hampshire": 1377529,
  "New Jersey": 9288994,
  "New Mexico": 2117522,
  "New York": 20201249,
  "North Carolina": 10439388,
  "North Dakota": 779094,
  "Ohio": 11799448,
  "Oklahoma": 3959353,
  "Oregon": 4237256,
  "Pennsylvania": 13002700,
  "Rhode Island": 1097379,
  "South Carolina": 5118425,
  "South Dakota": 886667,
  "Tennessee": 6910840,
  "Texas": 29145505,
  "Utah": 3271616,
  "Vermont": 643077,
  "Virginia": 8631393,
  "Washington": 7705281,
  "West Virginia": 1793716,
  "Wisconsin": 5893718,
  "Wyoming": 576851,
  "Puerto Rico": 3285874
};

// Collated from https://www.nationsonline.org/oneworld/map/US-timezone_map.htm and
// http://efele.net/maps/tz/us/
export const timezones: { [keys: string]: string[]; } = {
  // Mainland USA
  "America/Los_Angeles": [
    "California",
    "Nevada",
    "Oregon",
    "Washington",
  ],
  "America/Denver": [
    "Colorado",
    "Idaho",
    "Montana",
    "New Mexico",
    "Utah",
    "Wyoming",
  ],
  "America/Chicago": [
    "Alabama",
    "Arkansas",
    "Illinois",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Nebraska",
    "North Dakota",
    "Oklahoma",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Wisconsin",
  ],
  "America/New_York": [
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Indiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "New Hampshire",
    "New Jersey",
    "New York",
    "North Carolina",
    "Ohio",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "Vermont",
    "Virginia",
    "West Virginia",
  ],
  "America/Phoenix": [
    "Arizona",
  ],
  // Odd ones out
  "US/Alaska": [
    "Alaska",
  ],
  "America/Puerto_Rico": [
    "Puerto Rico",
  ],
  "Pacific/Honolulu": [
    "Hawaii"
  ],
};

// Collated from BLS data, e.g. "Percent participating on an avg day - Sleeping, 10am-11am"
// https://beta.bls.gov/dataViewer/view/timeseries/TUU30105AA01051617
export const fractionAsleepData = [
  // 12am (midnight)
  0.866,
  0.927,
  0.948,
  0.954,
  0.924,
  0.859,
  // 6am
  0.672,
  0.435,
  0.242,
  0.132,
  0.067,
  0.044,
  // 12pm (midday)
  0.034,
  0.041,
  0.048,
  0.048,
  0.044,
  0.034,
  // 6pm
  0.027,
  0.035,
  0.071,
  0.191,
  0.454,
  0.719
];
