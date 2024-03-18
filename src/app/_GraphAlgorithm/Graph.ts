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
export type MultipleInstructions = [Order, SingleInstruction[]];
export type TrackerArray = (SingleInstruction | MultipleInstructions)[];

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
    this.addInstruction([
      Order.Entry,
      [
        [Line.FinishedLine, 2],
        [Line.EntryLine, 3],
      ],
    ]);
    const queue = [root];
    const visited = new Set();

    visited.add(root);
    this.addInstruction([
      Order.Entry,
      [
        [Command.Visited, root],
        [Line.FinishedLine, 3],
        [Line.EntryLine, 4],
      ],
    ]);
    this.TRACKER.push([Line.FinishedLine, 4]);
    while (queue.length > 0) {
      this.TRACKER.push([Line.EntryLine, 6]);
      const vertex = queue.shift()!;

      this.addInstruction([
        Order.Entry,
        [
          [Command.EnteredQueue, vertex],
          [Line.EntryLine, 7],
        ],
      ]);
      this.TRACKER.push([Line.FinishedLine, 7]);
      for (const neighbour of this.graph.get(vertex) ?? []) {
        this.TRACKER.push([Line.EntryLine, 8]);
        if (!visited.has(neighbour)) {
          this.TRACKER.push([Line.EntryLine, 9]);
          visited.add(neighbour);
          this.TRACKER.push([Command.VisitPairs, [vertex, neighbour]]);
          this.addInstruction([
            Order.Entry,
            [
              [Command.Visited, neighbour],
              [Command.UnvisitPairs, [vertex, neighbour]],
              [Line.EntryLine, 10],
            ],
          ]);
          queue.push(neighbour);
          this.addInstruction([
            Order.Entry,
            [
              [Line.FinishedLine, 10],
              [Line.EntryLine, 11],
            ],
          ]);
          this.addInstruction([
            Order.Entry,
            [
              [Line.FinishedLine, 11],
              [Line.FinishedLine, 9],
            ],
          ]);
        }
        this.TRACKER.push([Line.FinishedLine, 8]);
      }

      this.addInstruction([
        Order.Entry,
        [
          [Command.Popped, vertex],
          [Line.FinishedLine, 6],
        ],
      ]);
      this.TRACKER.push([Line.FinishedLine, 6]);
    }
    this.TRACKER.push([Line.FinishedLine, 1]);
  }

  DFS(root: number) {
    this.TRACKER.push([Line.EntryLine, 1]);
    this.TRACKER.push([Line.EntryLine, 2]);
    const visited = new Set<number>();
    this.TRACKER.push([Line.FinishedLine, 2]);
    this.TRACKER.push([Line.EntryLine, 3]);
    this.TRACKER.push([Line.EntryLine, 5]);
    this.recursiveDFS(root, visited);
    this.TRACKER.push([Line.FinishedLine, 5]);
    this.TRACKER.push([Line.FinishedLine, 3]);
    this.TRACKER.push([Line.FinishedLine, 1]);
  }

  recursiveDFS(vertex: number, visited: Set<number>) {
    this.TRACKER.push([Line.EntryLine, 6]);
    if (!visited.has(vertex)) {
      this.TRACKER.push([Line.EntryLine, 7]);
      visited.add(vertex);
      this.TRACKER.push([Command.Visited, vertex]);
      this.TRACKER.push([Line.FinishedLine, 7]);
      this.TRACKER.push([Line.EntryLine, 8]);
      const neighbors = this.graph.get(vertex);
      this.TRACKER.push([Line.FinishedLine, 8]);

      if (neighbors) {
        this.TRACKER.push([Line.EntryLine, 9]);
        for (const neighbor of neighbors) {
          this.TRACKER.push([Line.EntryLine, 10]);

          this.TRACKER.push([Command.VisitPairs, [vertex, neighbor]]);
          this.TRACKER.push([Line.EntryLine, 11]);
          this.addInstruction([
            Order.Entry,
            [
              [Line.FinishedLine, 6],
              [Line.FinishedLine, 9],
              [Line.FinishedLine, 10],
              [Line.FinishedLine, 11],
            ],
          ]);
          this.recursiveDFS(neighbor, visited);
          this.TRACKER.push([Command.UnvisitPairs, [vertex, neighbor]]);
        }
      }
      this.TRACKER.push([Line.FinishedLine, 6]);
      this.TRACKER.push([Command.Popped, vertex]);
      this.TRACKER.push([Command.PoppedStack, vertex]); // With this addition it makes it slower but users can see more clearly how it works.
    }
  }
}

export class GraphDistance extends Graph {
  private ALLNODES: Map<number, number>;
  private distances: Map<string, number>;
  private nodes: Set<number>;
  private edges: Array<{ node1: number; node2: number; weight: number }>;

  constructor() {
    super();
    this.distances = new Map();
    this.ALLNODES = new Map();
    this.nodes = new Set();
    this.edges = [];
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

      // clean up popping Queue if last node visited doesn't have child

      this.TRACKER.push([Line.FinishedLine, 9]);
    }
    this.TRACKER.push([Line.FinishedLine, 1]);
    [...this.ALLNODES.keys()]
      .filter((node) => !visited.has(node))
      .forEach((n) => {
        this.TRACKER.push([Command.Popped, n]);
      });
  }
  addEdgeCostUndirected(node1: number, node2: number, weight?: number) {
    if (!this.nodes.has(node1)) {
      this.nodes.add(node1);
    }
    if (!this.nodes.has(node2)) {
      this.nodes.add(node2);
    }
    if (weight !== undefined) this.edges.push({ node1, node2, weight });
  }
  PRIMSJARNIK(root: number) {
    this.TRACKER.push([Line.EntryLine, 1]);
    const visited = new Set<number>();
    const mstEdges: Array<{ node1: number; node2: number; weight: number }> =
      [];
    this.TRACKER.push([Line.EntryLine, 2]);
    this.TRACKER.push([Line.FinishedLine, 2]);
    this.TRACKER.push([Line.EntryLine, 3]);
    this.TRACKER.push([Line.FinishedLine, 3]);
    if (!this.nodes.has(root)) {
      this.TRACKER.push([Line.EntryLine, 5]);
      this.TRACKER.push([Line.FinishedLine, 5]);
      this.TRACKER.push([Line.EntryLine, 6]);
      this.TRACKER.push([Line.FinishedLine, 6]);
      return mstEdges;
    }

    visited.add(root);
    this.addInstruction([
      Order.Entry,
      [
        [Command.Visited, root],
        [Line.EntryLine, 9],
      ],
    ]);
    this.TRACKER.push([Line.FinishedLine, 9]);

    while (visited.size < this.nodes.size) {
      this.TRACKER.push([Line.EntryLine, 11]);
      let minEdge: { node1: number; node2: number; weight: number } | null =
        null;
      this.TRACKER.push([Line.EntryLine, 12]);
      this.TRACKER.push([Line.FinishedLine, 12]);
      for (const edge of this.edges) {
        this.TRACKER.push([Line.EntryLine, 13]);
        if (
          (visited.has(edge.node1) && !visited.has(edge.node2)) ||
          (visited.has(edge.node2) && !visited.has(edge.node1))
        ) {
          this.addInstruction([
            Order.Entry,
            [
              [Line.EntryLine, 14],
              [Line.EntryLine, 15],
              [Line.EntryLine, 16],
            ],
          ]);
          if (!minEdge || edge.weight < minEdge.weight) {
            this.TRACKER.push([Line.EntryLine, 17]);
            minEdge = edge;
            this.TRACKER.push([Line.EntryLine, 18]);
            this.TRACKER.push([Line.FinishedLine, 18]);
            this.TRACKER.push([Line.FinishedLine, 17]);
          }
          this.addInstruction([
            Order.Entry,
            [
              [Line.FinishedLine, 14],
              [Line.FinishedLine, 15],
              [Line.FinishedLine, 16],
            ],
          ]);
        }
      }
      this.TRACKER.push([Line.FinishedLine, 13]);
      if (!minEdge) {
        this.TRACKER.push([Line.EntryLine, 22]);
        this.TRACKER.push([Line.EntryLine, 23]);
        this.addInstruction([
          Order.Entry,
          [
            [Line.FinishedLine, 22],
            [Line.FinishedLine, 23],
            [Line.FinishedLine, 11],
          ],
        ]);
        break;
      }
      mstEdges.push(minEdge);
      this.TRACKER.push([Command.VisitPairs, [minEdge.node1, minEdge.node2]]);
      this.addInstruction([
        Order.Entry,
        [
          [Command.VisitPairs, [minEdge.node1, minEdge.node2]],
          [Line.EntryLine, 25],
        ],
      ]);
      this.TRACKER.push([Line.FinishedLine, 25]);

      if (!visited.has(minEdge.node1)) {
        visited.add(minEdge.node1);
        this.addInstruction([
          Order.Entry,
          [
            [Line.EntryLine, 27],
            [Line.EntryLine, 28],
            [Command.Visited, minEdge.node1],
          ],
        ]);
        this.addInstruction([
          Order.Entry,
          [
            [Line.FinishedLine, 27],
            [Line.FinishedLine, 28],
          ],
        ]);
      } else {
        visited.add(minEdge.node2);
        this.addInstruction([
          Order.Entry,
          [
            [Line.EntryLine, 29],
            [Line.EntryLine, 30],
            [Command.Visited, minEdge.node2],
          ],
        ]);
        this.addInstruction([
          Order.Entry,
          [
            [Line.FinishedLine, 29],
            [Line.FinishedLine, 30],
          ],
        ]);
      }
      this.TRACKER.push([Line.FinishedLine, 11]);
    }
    this.TRACKER.push([Line.FinishedLine, 1]);
  }
}
