import { DEFAULT_RECTANGLE_SIZE } from "~/app/constants/Node/index";

export const getCoords = (val: number) => {
  return val - DEFAULT_RECTANGLE_SIZE / 2;
};
