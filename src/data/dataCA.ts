const data = {
  populations: {
    "Alberta": 4262635,
    "British Columbia": 5000879,
    "Manitoba": 1342153,
    "New Brunswick": 775610,
    "Newfoundland and Labrador": 510550,
    "Northwest Territories": 41070,
    "Nova Scotia": 969383,
    "Nunavut": 36858,
    "Ontario": 14223942,
    "Prince Edward Island": 154331,
    "Quebec": 8501833,
    "Saskatchewan": 1132505,
    "Yukon": 40232,
  },
  timezones: {
    // PST/PDT
    "America/Vancouver": ["British Columbia"],
    // MST/MDT
    "America/Edmonton": ["Alberta", "Northwest Territories"],
    // MST
    "America/Whitehorse": ["Yukon"],
    // CST/CDT
    "America/Winnipeg": ["Manitoba"],
    // CST
    "America/Regina": ["Saskatchewan"],
    // EST/EDT
    "America/Toronto": ["Nunavut", "Ontario", "Quebec"],
    // AST/ADT
    "America/Halifax": ["New Brunswick", "Nova Scotia", "Prince Edward Island"],
    // NST/NDT
    "America/St_Johns": ["Newfoundland and Labrador"]
  },
  fractionAsleepAt: [
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
  ],
};

export default data;
