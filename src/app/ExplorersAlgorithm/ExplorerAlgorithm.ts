import type { GridNode } from "../types";

export default class ExplorerGraph {
  public grid: GridNode[][];

  constructor(grid: GridNode[][]) {
    this.grid = grid;
  }

  public static executeAlgorithm(
    algorithm: string,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    grid: GridNode[][],
  ): { shortestPath: GridNode[]; visitedNodesInOrder: GridNode[] } {
    const explorerGraphs = new ExplorerGraph(grid);

    switch (algorithm) {
      case "bfs":
        return explorerGraphs.bfs(startRow, startCol, endRow, endCol);
      case "dijkstra":
        return explorerGraphs.dijkstra(startRow, startCol, endRow, endCol);
      case "dfs":
        return explorerGraphs.dfs(startRow, startCol, endRow, endCol);
      case "greedyBFS":
        return explorerGraphs.greedyBFS(startRow, startCol, endRow, endCol);
      case "aStar":
        return explorerGraphs.aStar(startRow, startCol, endRow, endCol);
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }

  public static executeInstantAlgorithm(
    algorithm: string,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    grid: GridNode[][],
  ): GridNode[][] {
    const explorerGraphs = new ExplorerGraph(grid);

    switch (algorithm) {
      case "bfs":
        return explorerGraphs.bfsInstant(startRow, startCol, endRow, endCol);
      case "dijkstra":
        return explorerGraphs.dijkstraInstant(
          startRow,
          startCol,
          endRow,
          endCol,
        );
      case "dfs":
        return explorerGraphs.dfsInstant(startRow, startCol, endRow, endCol);
      case "greedyBFS":
        return explorerGraphs.greedyBFSInstant(
          startRow,
          startCol,
          endRow,
          endCol,
        );
      case "aStar":
        return explorerGraphs.aStarInstant(startRow, startCol, endRow, endCol);
      default:
        console.error(`Unknown algorithm: ${algorithm}`);
        return grid;
    }
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
        (!neighborNode.isBlock || neighborNode.isStart || neighborNode.isEnd)
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

  public dijkstraInstant(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): GridNode[][] {
    const startNode = this.grid[startRow]![startCol];
    const endNode = this.grid[endRow]![endCol];

    if (!startNode || !endNode) {
      throw new Error("Invalid start or end node");
    }

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
      }

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        this.updateDistance(currentNode, neighbor);
      }
    }

    if (endNode.distance === Infinity) {
      return this.grid;
    }

    let currentNode: GridNode | null = endNode;

    while (currentNode) {
      currentNode.type = "shortestPath";
      currentNode = currentNode.previousNode;
    }
    console.log(
      " start node = ",
      startNode,
      this.grid,
      "",
      this.grid.flat().filter((node) => node.type === "shortestPath"),
    );
    return this.grid;
  }

  public bfs(
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
    const queue: GridNode[] = [];

    startNode.distance = 0;
    queue.push(startNode);

    while (queue.length > 0) {
      const currentNode = queue.shift()!;

      if (currentNode === endNode) {
        break;
      }

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (neighbor.distance === Infinity) {
          neighbor.distance = currentNode.distance + 1;
          neighbor.previousNode = currentNode;
          queue.push(neighbor);
        }
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
        visitedNodesInOrder.push(currentNode);
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

  public bfsInstant(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): GridNode[][] {
    const startNode = this.grid[startRow]![startCol];
    const endNode = this.grid[endRow]![endCol];

    if (!startNode || !endNode) {
      throw new Error("Invalid start or end node");
    }

    const queue: GridNode[] = [];

    startNode.distance = 0;
    queue.push(startNode);

    while (queue.length > 0) {
      const currentNode = queue.shift()!;

      if (currentNode === endNode) {
        break;
      }

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (neighbor.distance === Infinity) {
          neighbor.distance = currentNode.distance + 1;
          neighbor.previousNode = currentNode;
          queue.push(neighbor);
        }
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
      }
    }

    if (endNode.distance === Infinity) {
      return this.grid;
    }

    let currentNode: GridNode | null = endNode;

    while (currentNode) {
      currentNode.type = "shortestPath";
      currentNode = currentNode.previousNode;
    }

    return this.grid;
  }
  public dfs(
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
    const stack: GridNode[] = [];

    startNode.distance = 0;
    stack.push(startNode);

    while (stack.length > 0) {
      const currentNode = stack.pop()!;

      if (currentNode === endNode) {
        break;
      }

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (neighbor.distance === Infinity) {
          neighbor.distance = currentNode.distance + 1;
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
        visitedNodesInOrder.push(currentNode);
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

  public dfsInstant(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): GridNode[][] {
    const startNode = this.grid[startRow]![startCol];
    const endNode = this.grid[endRow]![endCol];

    if (!startNode || !endNode) {
      throw new Error("Invalid start or end node");
    }

    const stack: GridNode[] = [];

    startNode.distance = 0;
    stack.push(startNode);

    while (stack.length > 0) {
      const currentNode = stack.pop()!;

      if (currentNode === endNode) {
        break;
      }

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (neighbor.distance === Infinity) {
          neighbor.distance = currentNode.distance + 1;
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
      }
    }

    if (endNode.distance === Infinity) {
      return this.grid;
    }

    let currentNode: GridNode | null = endNode;

    while (currentNode) {
      currentNode.type = "shortestPath";
      currentNode = currentNode.previousNode;
    }

    return this.grid;
  }

  public greedyBFS(
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
    const priorityQueue: GridNode[] = [];

    startNode.distance = 0;
    priorityQueue.push(startNode);

    const calculateHeuristic = (node: GridNode): number => {
      return (
        Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col)
      );
    };

    while (priorityQueue.length > 0) {
      priorityQueue.sort(
        (a, b) => calculateHeuristic(a) - calculateHeuristic(b),
      );
      const currentNode = priorityQueue.shift()!;

      if (currentNode === endNode) {
        break;
      }

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (neighbor.distance === Infinity) {
          neighbor.distance = currentNode.distance + 1;
          neighbor.previousNode = currentNode;
          priorityQueue.push(neighbor);
        }
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
        visitedNodesInOrder.push(currentNode);
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

  public greedyBFSInstant(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): GridNode[][] {
    const startNode = this.grid[startRow]![startCol];
    const endNode = this.grid[endRow]![endCol];

    if (!startNode || !endNode) {
      throw new Error("Invalid start or end node");
    }

    const priorityQueue: GridNode[] = [];

    startNode.distance = 0;
    priorityQueue.push(startNode);

    const calculateHeuristic = (node: GridNode): number => {
      return (
        Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col)
      );
    };

    while (priorityQueue.length > 0) {
      priorityQueue.sort(
        (a, b) => calculateHeuristic(a) - calculateHeuristic(b),
      );
      const currentNode = priorityQueue.shift()!;

      if (currentNode === endNode) {
        break;
      }

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (neighbor.distance === Infinity) {
          neighbor.distance = currentNode.distance + 1;
          neighbor.previousNode = currentNode;
          priorityQueue.push(neighbor);
        }
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
      }
    }

    if (endNode.distance === Infinity) {
      return this.grid;
    }

    let currentNode: GridNode | null = endNode;

    while (currentNode) {
      currentNode.type = "shortestPath";
      currentNode = currentNode.previousNode;
    }

    return this.grid;
  }
  public aStar(
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
    const openSet: GridNode[] = [startNode];
    const closedSet: GridNode[] = [];

    startNode.gScore = 0;
    startNode.fScore = this.calculateHeuristic(startNode, endNode);

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.fScore - b.fScore);
      const currentNode = openSet.shift()!;

      if (currentNode === endNode) {
        break;
      }

      closedSet.push(currentNode);

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor) || neighbor.isBlock) {
          continue;
        }

        const tentativeGScore = currentNode.gScore + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= neighbor.gScore) {
          continue;
        }

        neighbor.previousNode = currentNode;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore =
          tentativeGScore + this.calculateHeuristic(neighbor, endNode);
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
        visitedNodesInOrder.push(currentNode);
      }
    }

    if (endNode.gScore === Infinity) {
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

  public aStarInstant(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): GridNode[][] {
    const startNode = this.grid[startRow]![startCol];
    const endNode = this.grid[endRow]![endCol];

    if (!startNode || !endNode) {
      throw new Error("Invalid start or end node");
    }

    const openSet: GridNode[] = [startNode];
    const closedSet: GridNode[] = [];

    startNode.gScore = 0;
    startNode.fScore = this.calculateHeuristic(startNode, endNode);

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.fScore - b.fScore);
      const currentNode = openSet.shift()!;

      if (currentNode === endNode) {
        break;
      }

      closedSet.push(currentNode);

      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor) || neighbor.isBlock) {
          continue;
        }

        const tentativeGScore = currentNode.gScore + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= neighbor.gScore) {
          continue;
        }

        neighbor.previousNode = currentNode;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore =
          tentativeGScore + this.calculateHeuristic(neighbor, endNode);
      }

      if (!currentNode.isBlock) {
        currentNode.type = "visited";
      }
    }

    if (endNode.gScore === Infinity) {
      return this.grid;
    }

    let currentNode: GridNode | null = endNode;

    while (currentNode) {
      currentNode.type = "shortestPath";
      currentNode = currentNode.previousNode;
    }

    return this.grid;
  }
  private calculateHeuristic(node: GridNode, targetNode: GridNode): number {
    return (
      Math.abs(node.row - targetNode.row) + Math.abs(node.col - targetNode.col)
    );
  }
}
