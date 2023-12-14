export default interface Node {
  id: string;
  val: number;
  x: number;
  y: number;
  visited: boolean;
  visitedChildrens: boolean;
  childNodes: Set<number>;
  distances: Map<number, number>;
  currentlyVisitedPair: boolean;
}
