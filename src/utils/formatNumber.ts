export function formatDisplayNumber(value: number) {
  const roundedValue = Math.round(value * 100) / 100;

  if (Number.isInteger(roundedValue)) {
    return String(roundedValue);
  }

  return roundedValue.toFixed(2).replace(/\.?0+$/, '');
}
