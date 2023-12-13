import Graph, { GraphDistance } from "~/app/_GraphAlgorithm/Graph";

interface pageConfigurationType {
  algorithmName: string;
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
  algorithmName: "Breadth-First Search",
  provideEdgeLength: false,
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.BFS(rootValue);
  },
  addEdge: (g: Graph | GraphDistance, from: number, to: number) => {
    g.addEdge(from, to);
  },
  code: `BFS(root: number):
  visited = Set()
  queue = [root]
  visited.add(root)
  
  while queue is not empty:
      vertex = queue.dequeue()   // Dequeue the first element from the queue
      
      for neighbour in graph.get(vertex) or an empty list:
          if neighbour is not in visited:
              visited.add(neighbour)
              queue.enqueue(neighbour)`,
};

export const pageConfigurationDFS: pageConfigurationType = {
  algorithmName: "Depth-First Search",
  provideEdgeLength: false,
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

export default pageConfigurationType;
