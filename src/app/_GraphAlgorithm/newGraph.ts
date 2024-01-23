class Graph {
  private nodes: Set<number>;
  private edges: Array<{ node1: number; node2: number; weight: number }>;

  constructor() {
    this.nodes = new Set();
    this.edges = [];
  }

  addEdge(node1: number, node2: number, weight: number) {
    if (!this.nodes.has(node1)) {
      this.nodes.add(node1);
    }
    if (!this.nodes.has(node2)) {
      this.nodes.add(node2);
    }
    if (weight !== undefined) this.edges.push({ node1, node2, weight });
  }

  primMST(root: number) {
    const visited = new Set<number>();
    const mstEdges: Array<{ node1: number; node2: number; weight: number }> =
      [];

    if (this.nodes.size === 0) {
      return mstEdges;
    }

    visited.add(root);
    while (visited.size < this.nodes.size) {
      let minEdge: { node1: number; node2: number; weight: number } | null =
        null;
      for (const edge of this.edges) {
        if (
          (visited.has(edge.node1) && !visited.has(edge.node2)) ||
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

    return mstEdges;
  }

  dijkstra(startNode: number): Map<number, number> {
    const distances = new Map<number, number>();
    const priorityQueue = new Map<number, number>();

    for (const node of this.nodes) {
      distances.set(node, Infinity);
      priorityQueue.set(node, Infinity);
    }

    distances.set(startNode, 0);
    priorityQueue.set(startNode, 0);

    while (priorityQueue.size > 0) {
      const currentNode = this.getMinNode(priorityQueue);
      if (currentNode === undefined) {
        break;
      }

      priorityQueue.delete(currentNode);

      for (const edge of this.edges) {
        if (edge.node1 === currentNode) {
          const neighborNode = edge.node2;
          const totalDistance = distances.get(currentNode)! + edge.weight;

          if (totalDistance < distances.get(neighborNode)!) {
            distances.set(neighborNode, totalDistance);
            priorityQueue.set(neighborNode, totalDistance);
          }
        }
      }
    }

    return distances;
  }

  private getMinNode(priorityQueue: Map<number, number>): number | undefined {
    let minNode: number | undefined = undefined;
    let minDistance = Infinity;

    for (const [node, distance] of priorityQueue) {
      if (distance < minDistance) {
        minNode = node;
        minDistance = distance;
      }
    }

    return minNode;
  }
}

// Example usage:
const graph = new Graph();

// graph.addEdge(1, 2, 2);
// graph.addEdge(1, 3, 3);
// graph.addEdge(1, 4, 3);

// graph.addEdge(2, 3, 4);
// graph.addEdge(2, 5, 3);

// graph.addEdge(3, 4, 5);
// graph.addEdge(3, 5, 1);
// graph.addEdge(3, 6, 6);

// graph.addEdge(4, 6, 7);

// graph.addEdge(6, 5, 8);
// graph.addEdge(6, 7, 9);

graph.addEdge(1, 2, 4); // A-> B
graph.addEdge(1, 3, 2); // A -> C

graph.addEdge(2, 3, 3); // B-> C
graph.addEdge(3, 2, 1); // C -> B

graph.addEdge(2, 4, 2); // B-> D
graph.addEdge(2, 5, 3); // B -> E

graph.addEdge(3, 4, 4); // C->D
graph.addEdge(3, 5, 5); // C-> E

graph.addEdge(5, 4, 1); // E-> D

const mst = graph.primMST(1);
console.log("Minimum Spanning Tree:", mst);
const totalWeight = mst.reduce((acc, edge) => acc + edge.weight, 0);
console.log("Total weight for MST = ", totalWeight);

const dijkstraDistances = graph.dijkstra(1);
console.log("Dijkstra Shortest Distances:", dijkstraDistances);
