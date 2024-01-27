import {
  DEFAULT_NODE_ACTIVE_COLOUR,
  DEFAULT_NODE_VISITED_COLOUR,
  DEFAULT_NODE_COMPLETED_COLOUR,
  DEFAULT_NODE_UNVISITED_COLOUR,
} from "~/app/constants/Node/index";
export const getNodeColour = (
  isClicked: boolean,
  visited: boolean,
  visitedChildrens: boolean,
) => {
  return isClicked
    ? DEFAULT_NODE_ACTIVE_COLOUR
    : visited
    ? visitedChildrens
      ? DEFAULT_NODE_COMPLETED_COLOUR
      : DEFAULT_NODE_VISITED_COLOUR
    : DEFAULT_NODE_UNVISITED_COLOUR;
};
