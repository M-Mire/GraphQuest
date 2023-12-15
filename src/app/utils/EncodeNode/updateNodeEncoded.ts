// Create a copy of a node and will append a childNode with distance of 0
import Node from "../../model/Node";
import copyNode from "../copyNode";

const updateNodeEncoded = (node: Node, childNode: number, distance: number) => {
  const updateNode = copyNode(node);
  updateNode.childNodes.push(childNode);
  updateNode.distances.push(distance);
  updateNode.visited = false;
  updateNode.currentlyVisitedPair = false;
  console.log(updateNode);
  return encodeURIComponent(JSON.stringify(updateNode));
};

export default updateNodeEncoded;
