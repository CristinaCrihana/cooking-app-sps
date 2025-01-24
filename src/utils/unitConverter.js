
const conversionRatios = {
  ml: {
    l: 0.001,
    cup: 0.00422675,
    tbsp: 0.067628,
    tsp: 0.202884
  },
  l: {
    ml: 1000,
    cup: 4.22675,
    tbsp: 67.628,
    tsp: 202.884
  },
  cup: {
    ml: 236.588,
    l: 0.236588,
    tbsp: 16,
    tsp: 48
  },
  tbsp: {
    ml: 14.7868,
    l: 0.0147868,
    cup: 0.0625,
    tsp: 3
  },
  tsp: {
    ml: 4.92892,
    l: 0.00492892,
    cup: 0.0208333,
    tbsp: 0.333333
  },
  
  g: {
    kg: 0.001,
    oz: 0.035274,
    lb: 0.00220462
  },
  kg: {
    g: 1000,
    oz: 35.274,
    lb: 2.20462
  },
  oz: {
    g: 28.3495,
    kg: 0.0283495,
    lb: 0.0625
  },
  lb: {
    g: 453.592,
    kg: 0.453592,
    oz: 16
  }
};

const unitAliases = {
  milliliter: 'ml',
  milliliters: 'ml',
  'ml': 'ml',
  liter: 'l',
  liters: 'l',
  'l': 'l',
  cup: 'cup',
  cups: 'cup',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  'tbsp': 'tbsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  'tsp': 'tsp',
  
  gram: 'g',
  grams: 'g',
  'g': 'g',
  kilogram: 'kg',
  kilograms: 'kg',
  'kg': 'kg',
  ounce: 'oz',
  ounces: 'oz',
  'oz': 'oz',
  pound: 'lb',
  pounds: 'lb',
  'lb': 'lb',
  
  // Count
  piece: 'piece',
  pieces: 'piece',
  '': 'piece', 
  ' ': 'piece' 
};

export const standardizeUnit = (unit) => {
  const standardUnit = unitAliases[unit?.toLowerCase()?.trim()] || 'piece';
  return standardUnit;
};

export const convert = (value, fromUnit, toUnit) => {
  // Standardize units
  const standardFromUnit = standardizeUnit(fromUnit);
  const standardToUnit = standardizeUnit(toUnit);

  if (standardFromUnit === standardToUnit) {
    return value;
  }

  if (!conversionRatios[standardFromUnit] || !conversionRatios[standardFromUnit][standardToUnit]) {
    throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}`);
  }

  return value * conversionRatios[standardFromUnit][standardToUnit];
}; 