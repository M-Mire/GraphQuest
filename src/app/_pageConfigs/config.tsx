import Graph from "~/app/_GraphAlgorithm/Graph";

interface pageConfigurationType {
  algorithmName: string;
  runAlgorithm: (g: Graph, rootValue: number) => void;
  code: string;
}

export const pageConfigurationBFS: pageConfigurationType = {
  algorithmName: "Breadth-First Search",
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.BFS(rootValue);
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
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.DFS(rootValue);
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
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.DFS(rootValue);
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

export default {};
