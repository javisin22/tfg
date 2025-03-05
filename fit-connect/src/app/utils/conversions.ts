// Converts kilograms to pounds and returns a string with 2 decimals.
export function kgToLb(kg: number): string {
  return (kg * 2.20462).toFixed(2);
}

// Converts pounds to kilograms and returns a string with 2 decimals.
export function lbToKg(lb: number): string {
  return (lb / 2.20462).toFixed(2);
}

// Converts centimeters to a string in the format "Xft Yin" with inches rounded to one decimal.
export function cmToFeetInches(cm: number): string {
  const totalInches = cm * 0.393701;
  const feet = Math.floor(totalInches / 12); // preserves the decimal part
  const inches = totalInches - feet * 12;
  return `${feet}ft ${inches.toFixed(1)}in`; // example: "5ft 7.3in"
}

// Converts feet and inches (as numbers) back to centimeters.
export function feetInchesToCm(feet: number, inches: number): string {
  const totalInches = feet * 12 + inches;
  return (totalInches / 0.393701).toFixed(2); // returns a string with 2 decimals
}
