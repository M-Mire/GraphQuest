enum Command {
  EnteredQueue = "EnteredQueue",
  PoppedQueue = "PoppedQueue",
  Visited = "Visited",
  VisitPairs = "VisitPairs",
  UnvisitPairs = "UnvisitPairs",
  UpdateMap = "UpdateMap",
  Unvisit = "Unvisit",
}

enum Line {
  EntryLine = "EntryLine",
  FinishedLine = "FinishedLine",
  LineReset = "LineReset",
}

enum Order {
  Entry = "EntryOrder",
}

type InstructionType = Command | Line | Order;

type TrackerElementType = number | number[] | Map<number, number>;

type SingleInstruction = [InstructionType, TrackerElementType];
type MultipleInstructions = [Order, Array<SingleInstruction>];

type TrackerArray = Array<SingleInstruction | MultipleInstructions>;

class Graph {
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
    const visited = new Set();
    const queue = [root];
    this.TRACKER.push([Command.Visited, root]);
    visited.add(root);
    while (queue.length > 0) {
      const vertex = queue.shift()!;
      this.TRACKER.push([Command.EnteredQueue, vertex]);
      for (const neighbour of this.graph.get(vertex) ?? []) {
        if (!visited.has(neighbour)) {
          this.TRACKER.push([Command.Visited, neighbour]);
          visited.add(neighbour);
          queue.push(neighbour);
        }
      }
      this.TRACKER.push([Command.PoppedQueue, vertex]);
    }
    this.addInstruction([
      Order.Entry,
      [
        [Command.PoppedQueue, 22],
        [Command.Visited, 55],
      ],
    ]);
  }
}

const graph = new Graph();

graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(2, 1);
graph.addEdge(1, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(2, 4);
graph.addEdge(3, 2);
graph.addEdge(3, 4);
graph.addEdge(3, 5);
graph.addEdge(4, 5);

const rootId = 0;
graph.BFS(rootId);

// console.log(graph.getTracker());

const v = graph.getTracker();

// for (let i = 0; i < v.length; i++) {
//   const element = v[i];
//   console.log(element);
// }
