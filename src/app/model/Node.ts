export default interface Node {
  id: string;
  val: number;
  x: number;
  y: number;
  visited: boolean;
  visitedChildrens: boolean;
  childNodes: number[];
  distances: number[];
  connectedTo: number[];
}
