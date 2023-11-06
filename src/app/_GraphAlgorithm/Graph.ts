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
  private distances: Map<string, number>;
  private TRACKER: Array<[Command | Line, number]>;

  constructor() {
    this.graph = new Map();
    this.distances = new Map();
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

  addEdgeDistance(u: number, v: number, distance: number) {
    this.addEdge(u, v);
    this.distances.set(`${u}-${v}`, distance); // Store distance in the distances map
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

  // DIJKSTRA(root: number): Map<number, number> {
  //   const distance = new Map();
  //   const visited = new Set();

  //   this.graph.forEach((_, node) => {
  //     distance.set(node, Infinity);
  //   });
  //   distance.set(root, 0);

  //   while (visited.size < this.graph.size) {
  //     let minDistance: number = Infinity;
  //     let minDistanceNode = -1;

  //     this.graph.forEach((_, node) => {
  //       if (!visited.has(node) && distance.get(node)! < minDistance) {
  //         minDistance = distance.get(node)!;
  //         minDistanceNode = node;
  //       }
  //     });

  //     if (minDistanceNode === -1) {
  //       break;
  //     }

  //     visited.add(minDistanceNode);

  //     const neighbors: number[] = Array.from(
  //       this.graph.get(minDistanceNode) ?? [],
  //     );
  //     for (const neighbor of neighbors) {
  //       const edgeWeight = this.distances.get(`${minDistanceNode}-${neighbor}`);
  //       if (neighbor !== undefined && edgeWeight !== undefined) {
  //         const altDistance = distance.get(minDistanceNode)! + edgeWeight;
  //         if (altDistance < (distance.get(neighbor) || Infinity)) {
  //           distance.set(neighbor, altDistance);
  //         }
  //       }
  //     }
  //   }
  //   return distance;
  // }
}
// const graph = new Graph();

// graph.addEdgeDistance(0, 1, 5);
// graph.addEdgeDistance(0, 2, 1);
// graph.addEdgeDistance(2, 1, 3);
// graph.addEdgeDistance(1, 2, 2);
// graph.addEdgeDistance(1, 3, 3);
// graph.addEdgeDistance(1, 4, 20);
// graph.addEdgeDistance(2, 4, 12);
// graph.addEdgeDistance(3, 2, 3);
// graph.addEdgeDistance(3, 4, 2);
// graph.addEdgeDistance(3, 5, 6);
// graph.addEdgeDistance(4, 5, 1);

// const rootId = 0;
// let shortestDistances: Map<number, number> = graph.DIJKSTRA(rootId);

// console.log("Shortest Distances from Node 0 (Dijkstra's Algorithm):");
// shortestDistances.forEach((distance, node) => {
//   console.log(`Node ${node}: Distance ${distance}`);
// });
