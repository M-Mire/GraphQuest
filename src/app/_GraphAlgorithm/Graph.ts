export enum Command {
  EnteredQueue = "EnteredQueue",
  PoppedQueue = "PoppedQueue",
  Visited = "Visited",
  VisitPairs = "VisitPairs",
  UnvisitPairs = "UnvisitPairs",
  UpdateMap = "UpdateMap",
  Unvisit = "Unvisit",
}

export enum Line {
  EntryLine = "EntryLine",
  FinishedLine = "FinishedLine",
  LineReset = "LineReset",
}

export default class Graph {
  public graph: Map<number, number[]>;
  public TRACKER: Array<
    [Command | Line, number | number[] | Map<number, number>]
  >;

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
    const stack = [root];
    this.TRACKER.push([Command.Visited, root]);

    while (stack.length > 0) {
      const vertex = stack.pop()!;
      this.TRACKER.push([Command.EnteredQueue, vertex]);
      if (!visited.has(vertex)) {
        visited.add(vertex);
        this.TRACKER.push([Command.Visited, vertex]);
        const neighbours = (this.graph.get(vertex) ?? []).sort().reverse();
        for (const neighbour of neighbours) {
          if (!visited.has(neighbour)) {
            this.TRACKER.push([Command.Visited, neighbour]);
            stack.push(neighbour);
          }
        }
        this.TRACKER.push([Command.PoppedQueue, vertex]);
      }
    }
  }
}

export class GraphDistance extends Graph {
  private ALLNODES: Map<number, number>;
  private distances: Map<string, number>;

  constructor() {
    super();
    this.distances = new Map();
    this.ALLNODES = new Map();
  }
  addEdgeDistance(u: number, v: number, distance?: number) {
    this.addEdge(u, v);
    this.ALLNODES.set(u, 0);
    this.ALLNODES.set(v, 0);
    if (distance !== undefined) this.distances.set(`${u}-${v}`, distance);
  }

  DIJKSTRA(root: number) {
    const distance = new Map();
    const visited = new Set();

    this.ALLNODES.forEach((_, node) => {
      distance.set(node, Infinity);
    });

    distance.set(root, 0);
    const distanceCopyRoot = new Map(distance);
    this.TRACKER.push([Command.UpdateMap, distanceCopyRoot]);
    while (visited.size < this.graph.size) {
      let minDistance: number = Infinity;
      let minDistanceNode = -1;
      this.graph.forEach((_, node) => {
        if (!visited.has(node) && distance.get(node)! < minDistance) {
          minDistance = distance.get(node)!;
          minDistanceNode = node;
        }
      });
      if (minDistanceNode === -1) {
        break;
      }

      visited.add(minDistanceNode);
      // console.log(minDistanceNode + " has entered the stack");
      this.TRACKER.push([Command.Visited, minDistanceNode]);
      const neighbors: number[] = Array.from(
        this.graph.get(minDistanceNode) ?? [],
      );
      for (const neighbor of neighbors) {
        const edgeWeight = this.distances.get(`${minDistanceNode}-${neighbor}`);
        // console.log("-\n" + minDistanceNode + " -> " + neighbor);
        this.TRACKER.push([Command.VisitPairs, [minDistanceNode, neighbor]]);
        this.TRACKER.push([Command.Visited, neighbor]);
        if (neighbor !== undefined && edgeWeight !== undefined) {
          const altDistance = distance.get(minDistanceNode)! + edgeWeight;
          if (altDistance < (distance.get(neighbor) || Infinity)) {
            distance.set(neighbor, altDistance);
          }
        }
        const distanceCopy = new Map(distance);
        this.TRACKER.push([Command.UpdateMap, distanceCopy]);
        this.TRACKER.push([Command.Unvisit, neighbor]);
        this.TRACKER.push([Command.UnvisitPairs, [minDistanceNode, neighbor]]);
      }
      // console.log("All visited for " + minDistanceNode);
      this.TRACKER.push([Command.PoppedQueue, minDistanceNode]);
    }
    // console.log(this.getTracker());
  }
}

// const graph = new GraphDistance();

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
// graph.DIJKSTRA(rootId);
