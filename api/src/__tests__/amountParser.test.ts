import { parseAmountToCents } from '../utils/amountParser';

describe('parseAmountToCents', () => {
  it('should parse "$20,00" to 2000 cents', () => {
    expect(parseAmountToCents('$20,00')).toBe(2000);
  });

  it('should parse "$200,00" to 20000 cents', () => {
    expect(parseAmountToCents('$200,00')).toBe(20000);
  });

  it('should parse "20.00" to 2000 cents', () => {
    expect(parseAmountToCents('20.00')).toBe(2000);
  });

  it('should parse "20,00" to 2000 cents', () => {
    expect(parseAmountToCents('20,00')).toBe(2000);
  });

  it('should parse number 20.00 to 2000 cents', () => {
    expect(parseAmountToCents(20.00)).toBe(2000);
  });

  it('should handle amounts with spaces', () => {
    expect(parseAmountToCents('$ 20,00')).toBe(2000);
  });

  it('should throw error for invalid format', () => {
    expect(() => parseAmountToCents('invalid')).toThrow();
  });
});

