import Graph, { GraphDistance } from "~/app/_GraphAlgorithm/Graph";

interface pageConfigurationType {
  algorithmName: string;
  useDistance: boolean;
  runAlgorithm: (g: Graph | GraphDistance, rootValue: number) => void;
  addEdge: (
    g: Graph | GraphDistance,
    from: number,
    to: number,
    distance?: number,
  ) => void;
  code: string;
}
export const pageConfigurationBFS: pageConfigurationType = {
  algorithmName: "Breadth-First Search",
  useDistance: false,
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.BFS(rootValue);
  },
  addEdge: (g: Graph | GraphDistance, from: number, to: number) => {
    g.addEdge(from, to);
  },
  code: `BFS(root: number) {
        const visited = new Set();
        const queue = [root];
        visited.add(root);
      
        while (queue.length > 0) {
          const vertex = queue.shift();
          for (const neighbour of this.graph.get(vertex) || []) {
            if (!visited.has(neighbour)) {
              visited.add(neighbour);
              queue.push(neighbour);
            }
          }
        }
      }`,
};

export const pageConfigurationDFS: pageConfigurationType = {
  algorithmName: "Depth-First Search",
  useDistance: false,
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.DFS(rootValue);
  },
  addEdge: (g: Graph | GraphDistance, from: number, to: number) => {
    g.addEdge(from, to);
  },
  code: `DFS(root: number) {
    const visited = new Set();
    const queue = [root];

    while (queue.length > 0) {
      const vertex = queue.pop()!;
      if (!visited.has(vertex)) {
        visited.add(vertex);
        const neighbours = (this.graph.get(vertex) ?? []).sort().reverse();
        for (const neighbour of neighbours) {
          if (!visited.has(neighbour)) {
            queue.push(neighbour);
          }
        }
      }
    }
  }`,
};

export const pageConfigurationDijkstra: pageConfigurationType = {
  algorithmName: "Dijkstra Algorithm",
  useDistance: true,
  runAlgorithm: (g: Graph | GraphDistance, rootValue: number) => {
    if (g instanceof GraphDistance) g.DIJKSTRA(rootValue);
  },
  addEdge: (
    g: Graph | GraphDistance,
    from: number,
    to: number,
    distance?: number,
  ) => {
    if (g instanceof GraphDistance) g.addEdgeDistance(from, to, distance);
  },
  code: ``,
};

export default {};
