/**
 * Ensures that a given value stays within the bounds.
 * If the value is less than the minimum bound, it returns the minimum bound.
 * If the value is greater than the maximum bound, it returns the maximum bound.
 * Otherwise, it returns the original value.
 *
 * @param val - The value to be checked and adjusted if necessary.
 * @param minBound - The minimum allowed value.
 * @param maxBound - The maximum allowed value.
 * @returns The adjusted value within the specified bounds.
 */
export const handleOutOfBoundPosition = (
  val: number,
  minBound: number,
  maxBound: number,
) => {
  return val < minBound ? minBound : val > maxBound ? maxBound : val;
};
