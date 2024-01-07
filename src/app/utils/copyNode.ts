import type Node from "../model/Node";

const copyNode = (node: Node) => {
  return JSON.parse(JSON.stringify(node)) as Node;
};

export default copyNode;
