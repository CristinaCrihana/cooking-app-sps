import { convert, standardizeUnit } from '../unitConverter';

describe('Unit Converter Utility', () => {
  test('converts grams to kilograms correctly', () => {
    expect(convert(1000, 'g', 'kg')).toBe(1);
    expect(convert(500, 'g', 'kg')).toBe(0.5);
  });

  test('converts milliliters to liters correctly', () => {
    expect(convert(1000, 'ml', 'l')).toBe(1);
    expect(convert(500, 'ml', 'l')).toBe(0.5);
  });

  test('standardizes unit abbreviations correctly', () => {
    expect(standardizeUnit('gram')).toBe('g');
    expect(standardizeUnit('grams')).toBe('g');
    expect(standardizeUnit('kilogram')).toBe('kg');
    expect(standardizeUnit('g')).toBe('g');
  });

  test('throws error for incompatible unit conversion', () => {
    expect(() => convert(1, 'g', 'l')).toThrow('Cannot convert from g to l');
  });
});