import { createMaskCurrency, createUnmaskCurrency } from '@/lib/mask';

describe('createMaskCurrency', () => {
  it('should return correctly masked currency with default options', () => {
    const result1 = createMaskCurrency('1234.5');
    const result2 = createMaskCurrency('1234');

    expect(result1).toEqual({
      masked: '1.234',
      maskedRaw: '1.234',
      isNegative: false,
    });

    expect(result2).toEqual({
      masked: '1.234',
      maskedRaw: '1.234',
      isNegative: false,
    });
  });

  it('should handle negative number correctly with default options', () => {
    const result = createMaskCurrency('-1234.5');
    expect(result).toEqual({
      masked: '-1.234',
      maskedRaw: '-1.234',
      isNegative: true,
    });
  });

  it('should return correctly masked currency with custom delimiter, separator & precision', () => {
    const result = createMaskCurrency('1234.55', {
      delimiter: ',',
      separator: '.',
      precision: 2,
    });

    expect(result).toEqual({
      masked: '1,234.55',
      maskedRaw: '1,234.55',
      isNegative: false,
    });
  });

  it('should handle prefix correctly', () => {
    const result = createMaskCurrency('12345', { prefix: '$' });
    expect(result).toEqual({
      masked: '$12.345',
      maskedRaw: '12.345',
      isNegative: false,
    });
  });

  it('should handle prefix as array correctly', () => {
    const result = createMaskCurrency('12345', { prefix: ['USD', ' ', '$'] });
    expect(result).toEqual({
      masked: 'USD $12.345',
      maskedRaw: '12.345',
      isNegative: false,
    });
  });

  it('should return 0 if input is not a number ', () => {
    const result = createMaskCurrency('abc');
    expect(result).toEqual({
      masked: '0',
      maskedRaw: '0',
      isNegative: false,
    });
  });
});

describe('createUnmaskCurrency', () => {
  it('should return unmasked currency without prefix', () => {
    const result = createUnmaskCurrency('$1.234,56', { prefix: '$' });
    expect(result).toBe('1234.56');
  });

  it('should return unmasked currency with custom delimiter and separator', () => {
    const result = createUnmaskCurrency('€1,234.56', {
      prefix: '€',
      delimiter: ',',
      separator: '.',
    });
    expect(result).toBe('1234.56');
  });

  it('should handle negative numbers', () => {
    const result = createUnmaskCurrency('-€98.765,43', { prefix: '€' });
    expect(result).toBe('-98765.43');
  });

  it('should handle prefix as array', () => {
    const result = createUnmaskCurrency('$USD12.345', { prefix: ['$', 'USD'] });
    expect(result).toBe('12345');
  });

  it('should handle invalid characters', () => {
    const result = createUnmaskCurrency('abc1.234def');
    expect(result).toBe('1234');
  });
});
