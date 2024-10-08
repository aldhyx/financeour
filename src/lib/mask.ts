export type MaskOptions = {
  /** Character for thousands delimiter. Defaults to `"."` */
  delimiter?: string;
  /** Decimal precision. Defaults to `2` */
  precision?: number;
  /** Decimal separator character. Defaults to `","`  */
  separator?: string;
  /** Mask to be prefixed on the mask result */
  prefix?: string | number | string[] | number[];
};

type CreateMaskCurrency = (
  text: string,
  options?: MaskOptions
) => {
  masked: string;
  maskedRaw: string;
  isNegative: boolean;
};

type CreateUnmaskCurrency = (
  maskedText: string,
  options?: MaskOptions
) => string;

export const createMaskCurrency: CreateMaskCurrency = (text, options = {}) => {
  // Set default values for options
  const delimiter = options.delimiter ?? '.';
  // decimal precision
  const precision = options.precision ?? 0;
  // decimal separator
  const separator = options.separator ?? '';
  let prefix = options.prefix ?? '';

  if (Array.isArray(prefix)) prefix = prefix.join('');

  // Handle negative values
  const isNegative = text.startsWith('-');
  const cleanedText = text.replace(/[^0-9.]/g, '');

  // Convert to a number and apply precision
  let numberValue: number | string = parseFloat(cleanedText);
  if (isNaN(numberValue)) {
    return { masked: `${prefix}0`, maskedRaw: `0`, isNegative: false };
  }

  // Ignore the float part if precision is set to 0 (default)
  numberValue =
    precision === 0 ? Math.floor(numberValue) : numberValue.toFixed(precision);

  // Split whole and decimal parts
  let [wholePart, decimalPart] = String(numberValue).split('.');

  // Add thousands delimiter to the whole part
  wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);

  // Combine whole and decimal with custom separator
  const formattedNumber = decimalPart
    ? `${wholePart}${separator}${decimalPart}`
    : wholePart;

  return {
    // Add prefix and handle negative numbers
    masked: `${isNegative ? '-' : ''}${prefix}${formattedNumber}`,
    maskedRaw: `${isNegative ? '-' : ''}${formattedNumber}`,
    isNegative,
  };
};

export const createUnmaskCurrency: CreateUnmaskCurrency = (
  maskedText,
  options
): string => {
  const delimiter = options?.delimiter ?? '.';
  const separator = options?.separator ?? ',';
  const prefix = options?.prefix ?? '';

  // Remove prefix if present
  let text = maskedText;

  if (typeof prefix === 'string' || typeof prefix === 'number') {
    text = text.replace(String(prefix), '');
  } else if (Array.isArray(prefix)) {
    prefix.forEach((p) => {
      text = text.replace(String(p), '');
    });
  }

  // Remove any delimiter and replace separator with a period
  text = text
    .replace(new RegExp(`\\${delimiter}`, 'g'), '') // Remove the delimiter
    .replace(separator, '.'); // Replace the decimal separator with a period

  // Remove any non-numeric characters except for minus sign and period
  text = text.replace(/[^0-9.-]/g, '');
  return text;
};
