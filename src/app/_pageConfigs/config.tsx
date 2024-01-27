import type Graph from "~/app/_GraphAlgorithm/Graph";
import { GraphDistance } from "~/app/_GraphAlgorithm/Graph";

export enum pageEnum {
  BFS = "BFS",
  DFS = "DFS",
  DIJKSTRA = "DIJKSTRA",
  PRIMS_JARNIK = "PRIMS_JARNIK",
}

export interface pageConfigurationType {
  id: pageEnum;
  algorithmName: string;
  urlName: string;
  isWeighted: boolean;
  isUndirectedGraph: boolean;
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
  id: pageEnum.BFS,
  algorithmName: "Breadth-First Search",
  urlName: "/",
  isWeighted: false,
  isUndirectedGraph: false,
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.BFS(rootValue);
  },
  addEdge: (g: Graph | GraphDistance, from: number, to: number) => {
    g.addEdge(from, to);
  },
  code: `BFS(root: number):
  const queue = [root];
  const visited = new Set();
  visited.add(root);

  while (queue.length) {
    const vertex = queue.shift();
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
};

export const pageConfigurationDFS: pageConfigurationType = {
  id: pageEnum.DFS,
  algorithmName: "Depth-First Search",
  urlName: "/dfs",
  isWeighted: false,
  isUndirectedGraph: false,
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.DFS(rootValue);
  },
  addEdge: (g: Graph | GraphDistance, from: number, to: number) => {
    g.addEdge(from, to);
  },
  code: `DFS(root: number) {
    const stack = [root];
    const visited = new Set();

    while (stack.length) {
      const vertex = stack.pop();
      if (!visited.has(vertex)) {
        visited.add(vertex);

      for (const neighbor of graph[vertex]) {
        stack.push(neighbor);
        }
      }
    }
  }`,
};

export const pageConfigurationDijkstra: pageConfigurationType = {
  id: pageEnum.DIJKSTRA,
  algorithmName: "Dijkstra Algorithm",
  urlName: "/dijkstra",
  isWeighted: true,
  isUndirectedGraph: false,
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
  code: `DIJKSTRA(root):
  distance = new Map() // Map to store distances from the root
  visited = new Set() // Set to track visited nodes

  for each node in ALLNODES:
      distance.set(node, Infinity)

  distance.set(root, 0) // Set distance to root as 0
  while visited.size < graph.size:
      minDistance = Infinity
      minDistanceNode = -1
      for each node in ALLNODES:
          if node is not visited and distance[node] < minDistance:
              minDistance = distance[node]
              minDistanceNode = node

      if minDistanceNode == -1:
          break
      visited.add(minDistanceNode) // Mark the node as visited
      neighbors = get neighbors of minDistanceNode

      for each neighbor in neighbors:
          edgeWeight = get edgeWeight between minDistanceNode and neighbor
          if neighbor is defined and edgeWeight is defined:
              altDistance = distance[minDistanceNode] + edgeWeight
              if altDistance < (distance[neighbor] or Infinity):
                  distance[neighbor] = altDistance`,
};

export const pageConfigurationPrimJarnik: pageConfigurationType = {
  id: pageEnum.PRIMS_JARNIK,
  algorithmName: "Prim-Jarnik Algorithm",
  urlName: "/primjarnik",
  isWeighted: true,
  isUndirectedGraph: true,
  runAlgorithm: (g: Graph | GraphDistance, rootValue: number) => {
    if (g instanceof GraphDistance) g.PRIMSJARNIK(rootValue);
  },
  addEdge: (
    g: Graph | GraphDistance,
    from: number,
    to: number,
    distance?: number,
  ) => {
    if (g instanceof GraphDistance) g.addEdgeCostUndirected(from, to, distance);
  },
  code: `PRIMSJARNIK(root: number) {
  const visited = new Set<number>();
  const mstEdges: Array<{ node1: number; node2: number; weight: number }> = [];

  if (!this.nodes.has(root)) {
    return mstEdges;
  }

  visited.add(root);

  while (visited.size < this.nodes.size) {
    let minEdge = null;
    for (const edge of this.edges) {
      if ((visited.has(edge.node1) && !visited.has(edge.node2)) ||
          (visited.has(edge.node2) && !visited.has(edge.node1))
      ) {
        if (!minEdge || edge.weight < minEdge.weight) {
          minEdge = edge;
        }
      }
    }
    if (!minEdge) {
      break;
    }
    mstEdges.push(minEdge);

    if (!visited.has(minEdge.node1)) {
      visited.add(minEdge.node1);
    } else {
      visited.add(minEdge.node2);
    }
  }
}`,
};

export const pageConfigurationMap: Map<pageEnum, pageConfigurationType> =
  new Map<pageEnum, pageConfigurationType>([
    [pageEnum.BFS, pageConfigurationBFS],
    [pageEnum.DFS, pageConfigurationDFS],
    [pageEnum.DIJKSTRA, pageConfigurationDijkstra],
    [pageEnum.PRIMS_JARNIK, pageConfigurationPrimJarnik],
  ]);

export default pageConfigurationType;
