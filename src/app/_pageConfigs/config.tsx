import Graph, { GraphDistance } from "~/app/_GraphAlgorithm/Graph";

export enum pageEnum {
  BFS = "BFS",
  DFS = "DFS",
  DIJKSTRA = "DIJKSTRA",
}

export interface pageConfigurationType {
  id: pageEnum;
  algorithmName: string;
  urlName: string;
  provideEdgeLength: boolean;
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
  provideEdgeLength: false,
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.BFS(rootValue);
  },
  addEdge: (g: Graph | GraphDistance, from: number, to: number) => {
    g.addEdge(from, to);
  },
  code: `BFS(root: number):
  const queue = [root];
  const visited = new Set();

  while (queue.length) {
    const vertex = queue.shift();

    if (!visited.has(vertex)) {
      visited.add(vertex);

      for (const neighbor of graph[vertex]) {
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
  provideEdgeLength: false,
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.DFS(rootValue);
  },
  addEdge: (g: Graph | GraphDistance, from: number, to: number) => {
    g.addEdge(from, to);
  },
  code: `DFS(root: number) {
    const stack = [root];
    const visited = new Set();
    const result = [];

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
  provideEdgeLength: true,
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

export const pageConfigurationMap: Map<pageEnum, pageConfigurationType> =
  new Map<pageEnum, pageConfigurationType>([
    [pageEnum.BFS, pageConfigurationBFS],
    [pageEnum.DFS, pageConfigurationDFS],
    [pageEnum.DIJKSTRA, pageConfigurationDijkstra],
  ]);

export default pageConfigurationType;
