import Node from "~/app/model/Node";
import { v4 as uuidv4 } from "uuid";

export default function newNode(x: number, y: number, val: number): Node {
  return {
    id: uuidv4(),
    val: val,
    x: x,
    y: y,
    visited: false,
    visitedChildrens: false,
    childNodes: new Set(),
    distances: new Map(),
    currentlyVisitedPair: false,
  };
}
