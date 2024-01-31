import type { GridNode } from "../types";

export default class ExplorerGraph {
  private grid: GridNode[][];

  constructor(grid: GridNode[][]) {
    this.grid = grid;
  }
  private updateDistance(node: GridNode, neighbor: GridNode) {
    const newDistance = node.distance + 1;

    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.previousNode = node;
    }
  }

  private getNeighbors(node: GridNode): GridNode[] {
    const neighbors: GridNode[] = [];
    const { row, col } = node;

    // Check if the node is not blocked or if it is an "end" or "start" type
    const isNeighborValid = (r: number, c: number): boolean => {
      const neighborNode = this.grid[r]?.[c];
      return (
        !!neighborNode &&
        (!neighborNode.isBlock ||
          neighborNode.type === "start" ||
          neighborNode.type === "end")
      );
    };

    const rowLength = this.grid[row]?.length;

    if (row > 0 && isNeighborValid(row - 1, col)) {
      neighbors.push(this.grid[row - 1]![col]!);
    }
    if (row < this.grid.length - 1 && isNeighborValid(row + 1, col)) {
      neighbors.push(this.grid[row + 1]![col]!);
    }
    if (col > 0 && isNeighborValid(row, col - 1)) {
      neighbors.push(this.grid[row]![col - 1]!);
    }
    if (rowLength && col < rowLength - 1 && isNeighborValid(row, col + 1)) {
      neighbors.push(this.grid[row]![col + 1]!);
    }

    return neighbors;
  }

  public dijkstra(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): { shortestPath: GridNode[]; visitedNodesInOrder: GridNode[] } {
    const startNode = this.grid[startRow]![startCol];
    const endNode = this.grid[endRow]![endCol];

    if (!startNode || !endNode) {
      throw new Error("Invalid start or end node");
    }

    const visitedNodesInOrder: GridNode[] = [];
    const unvisitedNodes = this.grid.flat();

    startNode.distance = 0;

    while (unvisitedNodes.some((node) => node.distance < Infinity)) {
      const currentNode = unvisitedNodes.reduce((minNode, node) =>
        node.distance < minNode.distance ? node : minNode,
      );
      if (currentNode === endNode) {
        break;
      }

      unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
        visitedNodesInOrder.push(currentNode);
      }
      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        this.updateDistance(currentNode, neighbor);
      }
    }

    if (endNode.distance === Infinity) {
      return { shortestPath: [], visitedNodesInOrder };
    }

    let currentNode: GridNode | null = endNode;
    const shortestPath: GridNode[] = [];

    while (currentNode) {
      shortestPath.push(currentNode);
      currentNode = currentNode.previousNode;
    }

    shortestPath.forEach((node) => {
      node.type = "shortestPath";
    });

    const result = {
      shortestPath: shortestPath.reverse(),
      visitedNodesInOrder,
    };
    return result;
  }
}
