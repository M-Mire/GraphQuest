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
  private graph: Map<number, number[]>;
  private TRACKER: Array<[Command | Line, number]>;

  constructor() {
    this.graph = new Map();
    this.TRACKER = [];
  }

  addEdge(u: number, v: number) {
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
    this.TRACKER.push([Line.EntryLine, 1]);
    this.TRACKER.push([Line.EntryLine, 2]);
    const visited = new Set();
    this.TRACKER.push([Line.FinishedLine, 2]);
    this.TRACKER.push([Line.EntryLine, 3]);
    const queue = [root];
    this.TRACKER.push([Line.FinishedLine, 3]);
    this.TRACKER.push([Command.Visited, root]);
    this.TRACKER.push([Line.EntryLine, 4]);
    visited.add(root);
    this.TRACKER.push([Line.FinishedLine, 4]);
    while (queue.length > 0) {
      this.TRACKER.push([Line.EntryLine, 6]);
      this.TRACKER.push([Line.EntryLine, 7]);
      const vertex = queue.shift()!;
      this.TRACKER.push([Line.FinishedLine, 7]);
      this.TRACKER.push([Command.EnteredQueue, vertex]);
      for (const neighbour of this.graph.get(vertex) ?? []) {
        this.TRACKER.push([Line.EntryLine, 8]);
        if (!visited.has(neighbour)) {
          this.TRACKER.push([Line.EntryLine, 9]);
          this.TRACKER.push([Command.Visited, neighbour]);
          this.TRACKER.push([Line.EntryLine, 10]);
          visited.add(neighbour);
          this.TRACKER.push([Line.FinishedLine, 10]);
          this.TRACKER.push([Line.EntryLine, 11]);
          queue.push(neighbour);
          this.TRACKER.push([Line.FinishedLine, 11]);
          this.TRACKER.push([Line.FinishedLine, 9]);
        }
        this.TRACKER.push([Line.FinishedLine, 8]);
      }
      this.TRACKER.push([Command.PoppedQueue, vertex]);
      this.TRACKER.push([Line.FinishedLine, 6]);
    }
    this.TRACKER.push([Line.FinishedLine, 1]);
  }

  DFS(root: number) {
    const visited = new Set();
    const queue = [root];
    this.TRACKER.push([Command.Visited, root]);

    while (queue.length > 0) {
      const vertex = queue.pop()!;
      this.TRACKER.push([Command.EnteredQueue, vertex]);
      if (!visited.has(vertex)) {
        visited.add(vertex);
        this.TRACKER.push([Command.Visited, vertex]);
        const neighbours = (this.graph.get(vertex) ?? []).sort().reverse();
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
