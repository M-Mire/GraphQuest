import type Node from "~/app/model/Node";
import { v4 as uuidv4 } from "uuid";

export default function createNewNode(x: number, y: number, val: number): Node {
  return {
    id: uuidv4(),
    val: val,
    x: x,
    y: y,
    visited: false,
    visitedChildrens: false,
    childNodes: [],
    distances: [],
    connectedTo: [],
  };
}
