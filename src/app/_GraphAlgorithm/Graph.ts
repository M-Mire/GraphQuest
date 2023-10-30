export enum Command {
  EnteredQueue = "EnteredQueue",
  PoppedQueue = "PoppedQueue",
  Visited = "Visited",
}

export enum Line {
  EntryLine = "EntryLine",
  FinishedLine = "FinishedLine",
  LineReset = "LineReset",
}

export default class Graph {
  private graph: Map<any, any[]>;
  private TRACKER: Array<[Command | Line, any]>;

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
    this.TRACKER.push([Command.Visited, root]);
    visited.add(root);
    while (queue.length > 0) {
      const vertex = queue.shift();
      this.TRACKER.push([Command.EnteredQueue, vertex]);
      for (const neighbour of this.graph.get(vertex) || []) {
        if (!visited.has(neighbour)) {
          this.TRACKER.push([Command.Visited, neighbour]);
          visited.add(neighbour);
          queue.push(neighbour);
        }
      }
      this.TRACKER.push([Command.PoppedQueue, vertex]);
    }
  }

  DFS(root: number) {
    const visited = new Set();
    const queue = [root];
    this.TRACKER.push([Command.Visited, root]);

    while (queue.length > 0) {
      const vertex = queue.pop();
      this.TRACKER.push([Command.EnteredQueue, vertex]);
      if (!visited.has(vertex)) {
        visited.add(vertex);
        this.TRACKER.push([Command.Visited, vertex]);
        const neighbours = (this.graph.get(vertex) || []).sort().reverse();
        for (const neighbour of neighbours) {
          if (!visited.has(neighbour)) {
            this.TRACKER.push([Command.Visited, neighbour]);
            queue.push(neighbour);
          }
        }
        this.TRACKER.push([Command.PoppedQueue, vertex]);
      }
    }
  }
}
