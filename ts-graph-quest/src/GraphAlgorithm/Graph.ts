export class Graph {
  private graph: Map<any, any[]>;
  private TRACKER: any[];
  constructor() {
    this.graph = new Map();
    this.TRACKER = [];
  }
  addEdge(u: any, v: any) {
    if (!this.graph.has(u)) {
      this.graph.set(u, []);
    }
    const uEdges = this.graph.get(u);
    if (uEdges) {
      uEdges.push(v);
    }
  }
  getTracker() {
    return this.TRACKER;
  }

  BFS(root: number) {
    const visited = new Set();
    const queue = [root];
    this.TRACKER.push("V:" + root);
    visited.add(root);

    while (queue.length > 0) {
      const currQueue = [...queue].reverse();
      const vertex = queue.shift();
      this.TRACKER.push("C:" + vertex);

      for (const neighbour of this.graph.get(vertex) || []) {
        if (!visited.has(neighbour)) {
          this.TRACKER.push("V:" + neighbour);
          visited.add(neighbour);
          queue.push(neighbour);
        }
      }
      this.TRACKER.push("F:" + vertex);
    }
  }
}
