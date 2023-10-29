const data = {
  populations: {
    "": 1,
  },
  timezones: {
    "Australia/Brisbane": [""],
  },
  fractionAsleepAt: [
    // 12am (midnight)
    1,
    1,
    1,
    1,
    1,
    1,
    // 6am
    1,
    1,
    1,
    1,
    0.9, // 10am = 10:00
    0.5, // 11am = 11:00
    // 12pm (midday)
    0.2, // 12pm = 12:00
    0.1,
    0.1,
    0.1,
    0.1,
    0.1,
    // 6pm
    0.1,
    0.2, // 7pm = 19:00
    0.5, // 8pm = 20:00
    0.9, // 9pm = 21:00
    1,
    1,
  ]
};

export default data;
