import { DEFAULT_RADIUS_BIG_CIRCLE } from "../constants/Node";
import { handleOutOfBoundPosition } from "./handleOutOfBoundPosition";
const PADDING = 3;

/**
 * Calculate adjusted coordinates within a specified element based on given x and y coordinates.
 * Adjusts the coordinates to fit within the element's bounds, considering scrolling and padding.
 *
 * @param x - X-coordinate relative to the canvas (EditMode)
 * @param y - Y-coordinate relative to the canvas (EditMode)
 * @param elementRef - Reference to the target HTMLDivElement
 * @returns An object containing adjusted x and y coordinates within the element's bounds
 */
export const calculateNewNodePosition = (
  x: number,
  y: number,
  elementRef: React.MutableRefObject<HTMLDivElement | null>,
) => {
  // Check if the element reference exists
  if (elementRef?.current) {
    const { left, top, width } = elementRef.current.getBoundingClientRect();
    // Calculate adjusted coordinates considering element's scroll and offset
    const node_x = x - left + elementRef.current.scrollLeft;
    const node_y = y - top + elementRef.current.scrollTop;

    // Define minimum and maximum bounds for x and y coordinates
    const MINBOUND_X = DEFAULT_RADIUS_BIG_CIRCLE;
    const MAXBOUND_X =
      elementRef.current.scrollWidth - DEFAULT_RADIUS_BIG_CIRCLE * 2;
    const MINBOUND_Y = DEFAULT_RADIUS_BIG_CIRCLE + PADDING;
    const MAXBOUND_Y =
      elementRef.current.scrollHeight - DEFAULT_RADIUS_BIG_CIRCLE * 2;

    // Adjust coordinates to fit within bounds using helper function
    return {
      node_x: handleOutOfBoundPosition(node_x, MINBOUND_X, MAXBOUND_X),
      node_y: handleOutOfBoundPosition(node_y, MINBOUND_Y, MAXBOUND_Y),
    };
  }
  // Log a message if the element reference is null
  console.log("elementRef is Null");
};
