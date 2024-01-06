export enum Command {
  EnteredQueue = "EnteredQueue",
  Popped = "Popped",
  Visited = "Visited",
  VisitPairs = "VisitPairs",
  UnvisitPairs = "UnvisitPairs",
  UpdateMap = "UpdateMap",
  Unvisit = "Unvisit",
  PoppedStack = "PoppedStack",
}

export enum Line {
  EntryLine = "EntryLine",
  FinishedLine = "FinishedLine",
  LineReset = "LineReset",
}

export enum Order {
  Entry = "EntryOrder",
}

export type InstructionType = Command | Line | Order;
export type TrackerElementType = number | number[] | Map<number, number>;

export type SingleInstruction = [Command | Line, TrackerElementType];
export type MultipleInstructions = [Order, Array<SingleInstruction>];

export type TrackerArray = Array<SingleInstruction | MultipleInstructions>;

export default class Graph {
  public graph: Map<number, number[]>;
  public TRACKER: TrackerArray = [];

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

  addInstruction(instruction: SingleInstruction | MultipleInstructions) {
    this.TRACKER.push(instruction);
  }

  BFS(root: number) {
    this.TRACKER.push([Line.EntryLine, 1]);
    this.TRACKER.push([Line.EntryLine, 2]);
    const visited = new Set();
    this.addInstruction([
      Order.Entry,
      [
        [Line.FinishedLine, 2],
        [Line.EntryLine, 3],
      ],
    ]);
    const queue = [root];

    this.addInstruction([
      Order.Entry,
      [
        [Line.FinishedLine, 3],
        [Command.Visited, root],
        [Line.EntryLine, 4],
      ],
    ]);
    visited.add(root);
    this.TRACKER.push([Line.FinishedLine, 4]);

    while (queue.length > 0) {
      this.TRACKER.push([Line.EntryLine, 6]);
      this.TRACKER.push([Line.EntryLine, 7]);
      const vertex = queue.shift()!;

      this.addInstruction([
        Order.Entry,
        [
          [Line.FinishedLine, 7],
          [Command.EnteredQueue, vertex],
        ],
      ]);

      for (const neighbour of this.graph.get(vertex) ?? []) {
        this.TRACKER.push([Line.EntryLine, 9]);
        if (!visited.has(neighbour)) {
          this.TRACKER.push([Line.EntryLine, 10]);
          this.TRACKER.push([Line.EntryLine, 11]);
          visited.add(neighbour);

          this.addInstruction([
            Order.Entry,
            [
              [Command.Visited, neighbour],
              [Line.FinishedLine, 11],
              [Line.EntryLine, 12],
            ],
          ]);
          queue.push(neighbour);
          this.TRACKER.push([Line.FinishedLine, 12]);
          this.TRACKER.push([Line.FinishedLine, 10]);
        }
        this.TRACKER.push([Line.FinishedLine, 9]);
      }

      this.addInstruction([
        Order.Entry,
        [
          [Command.Popped, vertex],
          [Line.FinishedLine, 6],
        ],
      ]);
    }
    this.TRACKER.push([Line.FinishedLine, 1]);
  }

  DFS(root: number) {
    const stack = [root];
    this.TRACKER.push([Command.Visited, root]);
    const visited = new Set<number>();

    const result: number[] = [];

    while (stack.length) {
      const vertex = stack.pop()!;
      this.TRACKER.push([Command.PoppedStack, vertex]);
      if (vertex !== undefined && !visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);

        const neighbors = this.graph.get(vertex);
        if (neighbors) {
          for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i]!;
            stack.push(neighbor);
            this.TRACKER.push([Command.Visited, neighbor]);
          }
        }
      }
      this.TRACKER.push([Command.Popped, vertex]);
    }

    return result;
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
    this.TRACKER.push([Line.EntryLine, 1]);
    this.TRACKER.push([Line.EntryLine, 2]);
    const distance = new Map<number, number>();
    this.TRACKER.push([Line.FinishedLine, 2]);
    const visited = new Set();
    this.TRACKER.push([Line.EntryLine, 3]);
    this.TRACKER.push([Line.FinishedLine, 3]);
    this.TRACKER.push([Line.EntryLine, 5]);
    this.TRACKER.push([Line.EntryLine, 6]);
    this.ALLNODES.forEach((_, node) => {
      distance.set(node, Infinity);
    });

    this.TRACKER.push([Line.FinishedLine, 6]);
    this.TRACKER.push([Line.FinishedLine, 5]);

    distance.set(root, 0);
    this.TRACKER.push([Line.EntryLine, 8]);
    this.TRACKER.push([Line.FinishedLine, 8]);
    const distanceCopyRoot = new Map(distance);
    this.TRACKER.push([Command.UpdateMap, distanceCopyRoot]);
    while (visited.size < this.graph.size) {
      this.TRACKER.push([Line.EntryLine, 9]);
      let minDistance = Infinity;
      this.TRACKER.push([Line.EntryLine, 10]);
      this.TRACKER.push([Line.FinishedLine, 10]);
      let minDistanceNode = -1;
      this.TRACKER.push([Line.EntryLine, 11]);
      this.TRACKER.push([Line.FinishedLine, 11]);
      this.graph.forEach((_, node) => {
        this.TRACKER.push([Line.EntryLine, 12]);
        if (!visited.has(node) && distance.get(node)! < minDistance) {
          this.TRACKER.push([Line.EntryLine, 13]);
          minDistance = distance.get(node)!;
          this.TRACKER.push([Line.EntryLine, 14]);
          this.TRACKER.push([Line.FinishedLine, 14]);
          minDistanceNode = node;
          this.TRACKER.push([Line.EntryLine, 15]);
          this.TRACKER.push([Line.FinishedLine, 15]);
          this.TRACKER.push([Line.FinishedLine, 13]);
        }
        this.TRACKER.push([Line.FinishedLine, 12]);
      });
      if (minDistanceNode === -1) {
        this.TRACKER.push([Line.EntryLine, 17]);
        this.TRACKER.push([Line.EntryLine, 18]);
        this.TRACKER.push([Line.FinishedLine, 18]);
        this.TRACKER.push([Line.FinishedLine, 17]);
        break;
      }
      visited.add(minDistanceNode);
      this.TRACKER.push([Line.EntryLine, 19]);
      this.TRACKER.push([Line.FinishedLine, 19]);

      this.TRACKER.push([Command.Visited, minDistanceNode]);
      const neighbors: number[] = Array.from(
        this.graph.get(minDistanceNode) ?? [],
      );

      this.TRACKER.push([Line.EntryLine, 20]);
      this.TRACKER.push([Line.FinishedLine, 20]);

      for (const neighbor of neighbors) {
        this.TRACKER.push([Line.FinishedLine, 22]);
        const edgeWeight = this.distances.get(`${minDistanceNode}-${neighbor}`);
        this.TRACKER.push([Line.EntryLine, 23]);
        this.TRACKER.push([Line.FinishedLine, 23]);
        // console.log("-\n" + minDistanceNode + " -> " + neighbor);
        this.TRACKER.push([Command.VisitPairs, [minDistanceNode, neighbor]]);
        this.TRACKER.push([Command.Visited, neighbor]);
        if (neighbor !== undefined && edgeWeight !== undefined) {
          this.TRACKER.push([Line.EntryLine, 24]);
          const altDistance: number =
            distance.get(minDistanceNode)! + edgeWeight;
          this.TRACKER.push([Line.EntryLine, 25]);
          this.TRACKER.push([Line.FinishedLine, 25]);
          if (altDistance < (distance.get(neighbor) ?? Infinity)) {
            this.TRACKER.push([Line.EntryLine, 26]);
            distance.set(neighbor, altDistance);
            this.TRACKER.push([Line.EntryLine, 27]);
            this.TRACKER.push([Line.FinishedLine, 27]);
            this.TRACKER.push([Line.FinishedLine, 26]);
          }
          this.TRACKER.push([Line.FinishedLine, 24]);
        }
        const distanceCopy = new Map(distance);
        this.TRACKER.push([Command.UpdateMap, distanceCopy]);
        this.TRACKER.push([Command.UnvisitPairs, [minDistanceNode, neighbor]]);
        this.TRACKER.push([Line.FinishedLine, 22]);
      }
      this.TRACKER.push([Command.Popped, minDistanceNode]);

      this.TRACKER.push([Line.FinishedLine, 9]);
    }
    this.TRACKER.push([Line.FinishedLine, 1]);
  }
}
