import type Node from "../../model/Node";
import copyNode from "../copyNode";

const updateNodeCoordEncoded = (node: Node, x: number, y: number) => {
  const updateNode = copyNode(node);
  updateNode.x = x;
  updateNode.y = y;
  updateNode.visited = false;
  updateNode.currentlyVisitedPair = false;
  return encodeURIComponent(JSON.stringify(updateNode));
};

export default updateNodeCoordEncoded;
