import { DEFAULT_RADIUS_BIG_CIRCLE } from "../constants/Node";
import { handleOutOfBoundsCoords } from "./handleOutOfBoundsCoords";
const PADDING = 3; // padding if out of bounds

export const getCoords = (
  x: number,
  y: number,
  elementRef: React.MutableRefObject<HTMLDivElement | null>,
) => {
  if (elementRef?.current) {
    const rect = elementRef.current.getBoundingClientRect();
    const node_x = x - rect.left + window.scrollX;
    const node_y = y - rect.top + window.scrollY;
    // console.log(elementRef.current.scrollWidth);

    const MINBOUND_X = DEFAULT_RADIUS_BIG_CIRCLE + PADDING;
    const MAXBOUND_X = window.innerWidth - rect.left;

    const MINBOUND_Y = DEFAULT_RADIUS_BIG_CIRCLE + PADDING;
    const MAXBOUND_Y =
      (window.innerHeight - rect.top) * 0.75 -
      DEFAULT_RADIUS_BIG_CIRCLE -
      PADDING;

    return {
      node_x: handleOutOfBoundsCoords(node_x, MINBOUND_X, MAXBOUND_X),
      node_y: handleOutOfBoundsCoords(node_y, MINBOUND_Y, MAXBOUND_Y),
    };
  } else {
    console.log("elementRef is Null");
  }
};
