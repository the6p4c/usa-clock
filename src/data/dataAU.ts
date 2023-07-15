const data = {
  // Australian Bureau of Statistics data
  // https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release
  populations: {
    "Australian Capital Territory": 460900,
    "New South Wales": 8238800,
    "Northern Territory": 250100,
    "Queensland": 5378300,
    "South Australia": 1834300,
    "Tasmania": 571600,
    "Victoria": 6704300,
    "Western Australia": 2825200,
  },
  // Collated from https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  timezones: {
    "Australia/Canberra": ["Australian Capital Territory"],
    "Australia/Sydney": ["New South Wales"],
    "Australia/Darwin": ["Northern Territory"],
    "Australia/Brisbane": ["Queensland"],
    "Australia/Adelaide": ["South Australia"],
    "Australia/Hobart": ["Tasmania"],
    "Australia/Melbourne": ["Victoria"],
    "Australia/Perth": ["Western Australia"],
  },
  // Australian Bureau of Statistics data; Table 13.1
  // https://www.abs.gov.au/statistics/people/people-and-communities/how-australians-use-their-time/latest-release
  fractionAsleepAt: [
    // 12am (midnight)
    0.92,
    0.947,
    0.958,
    0.962,
    0.945,
    0.895,
    // 6am
    0.713,
    0.434,
    0.211,
    0.095,
    0.053,
    0.034,
    // 12pm (midday)
    0.03,
    0.04,
    0.043,
    0.039,
    0.034,
    0.021,
    // 6pm
    0.017,
    0.031,
    0.129,
    0.341,
    0.631,
    0.827,
  ],
};

export default data;
