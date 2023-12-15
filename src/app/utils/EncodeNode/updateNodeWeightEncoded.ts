// Create a copy of a node and will append a childNode with distance of 0
import Node from "../../model/Node";

import copyNode from "../copyNode";

const updateNodeWeightEncoded = (
  node: Node,
  childNode: number,
  weight: number,
) => {
  const updateNode = copyNode(node);
  const indexOfChild = updateNode.childNodes.indexOf(childNode);
  updateNode.distances[indexOfChild] = weight;
  updateNode.visited = false;
  updateNode.currentlyVisitedPair = false;
  return encodeURIComponent(JSON.stringify(updateNode));
};

export default updateNodeWeightEncoded;
