import Node from "~/app/model/Node";
import EncodedNode from "~/app/model/EncodedNode";

export const getEncodedNode = (node: Node) => {
  const childNodeString = node.childNodes.join("-");
  const weightString = Array.from(node.distances.values()).join("-");
  return {
    id: node.id,
    val: node.val,
    x: node.x,
    y: node.y,
    childNodes: childNodeString,
    distances: weightString,
  } as EncodedNode;
};
