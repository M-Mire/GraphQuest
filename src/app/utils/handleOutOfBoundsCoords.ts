export const handleOutOfBoundsCoords = (
  val: number,
  minBound: number,
  maxBound: number,
) => {
  return val < minBound ? minBound : val > maxBound ? maxBound : val;
};
