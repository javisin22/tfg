import { kgToLb, lbToKg, cmToFeetInches, feetInchesToCm } from '../../utils/conversions';

describe('Weight Conversion Functions', () => {
  test('kgToLb converts kilograms to pounds correctly', () => {
    expect(kgToLb(1)).toBe('2.20');
    expect(kgToLb(10)).toBe('22.05');
    expect(kgToLb(70)).toBe('154.32');
  });

  test('lbToKg converts pounds to kilograms correctly', () => {
    expect(lbToKg(2.20462)).toBe('1.00');
    expect(lbToKg(22.0462)).toBe('10.00');
    expect(lbToKg(154.3234)).toBe('70.00');
  });
});

describe('Height Conversion Functions', () => {
  test('cmToFeetInches converts centimeters to feet and inches correctly', () => {
    expect(cmToFeetInches(30)).toBe('0ft 11.8in');
    expect(cmToFeetInches(152.4)).toBe('5ft 0.0in');
    expect(cmToFeetInches(182.88)).toBe('6ft 0.0in');
  });

  test('feetInchesToCm converts feet and inches to centimeters correctly', () => {
    expect(feetInchesToCm(0, 11.8)).toBe('29.97');
    expect(feetInchesToCm(5, 0)).toBe('152.40');
    expect(feetInchesToCm(6, 0)).toBe('182.88');
  });
});
