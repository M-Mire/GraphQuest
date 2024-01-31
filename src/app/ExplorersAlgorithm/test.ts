// type NodeType = "start" | "end" | "visited" | "normal" | "shortestPath";

// type GridNode = {
//   row: number;
//   col: number;
//   type: NodeType;
//   previousNode: GridNode | null;
//   distance: number;
// };

// type Grid = GridNode[][];

// class ExplorerGraphs {
//   public grid: GridNode[][];

//   constructor(grid: GridNode[][]) {
//     this.grid = grid;
//   }
//   private updateDistance(node: GridNode, neighbor: GridNode) {
//     const newDistance = node.distance + 1;

//     if (newDistance < neighbor.distance) {
//       neighbor.distance = newDistance;
//       neighbor.previousNode = node;
//     }
//   }

//   // Inside getNeighbors method
//   private getNeighbors(node: GridNode): GridNode[] {
//     const neighbors: GridNode[] = [];
//     const { row, col } = node;

//     if (row > 0 && this.grid[row - 1]?.[col]) {
//       neighbors.push(this.grid[row - 1]![col]!);
//     }
//     if (row < this.grid.length - 1 && this.grid[row + 1]?.[col]) {
//       neighbors.push(this.grid[row + 1]![col]!);
//     }
//     if (col > 0 && this.grid[row]?.[col - 1]) {
//       neighbors.push(this.grid[row]![col - 1]!);
//     }
//     if (col < this.grid[row]?.length! - 1 && this.grid[row]?.[col + 1]) {
//       neighbors.push(this.grid[row]![col + 1]!);
//     }

//     return neighbors.filter((neighbor) => neighbor.type !== "visited");
//   }

//   public dijkstra(
//     startRow: number,
//     startCol: number,
//     endRow: number,
//     endCol: number,
//   ): { shortestPath: GridNode[]; visitedNodesInOrder: GridNode[] } {
//     const startNode = this.grid[startRow]![startCol];
//     const endNode = this.grid[endRow]![endCol];

//     if (!startNode || !endNode) {
//       throw new Error("Invalid start or end node");
//     }

//     const visitedNodesInOrder: GridNode[] = [];
//     const unvisitedNodes = this.grid.flat();

//     startNode.distance = 0;

//     while (unvisitedNodes.some((node) => node.distance < Infinity)) {
//       const currentNode = unvisitedNodes.reduce((minNode, node) =>
//         node.distance < minNode.distance ? node : minNode,
//       );

//       if (currentNode === endNode) {
//         // If current node is the end node, break the loop
//         break;
//       }

//       unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);
//       currentNode.type = "visited";

//       visitedNodesInOrder.push(currentNode);

//       const neighbors = this.getNeighbors(currentNode);

//       for (const neighbor of neighbors) {
//         this.updateDistance(currentNode!, neighbor!);
//       }
//     }

//     if (endNode.distance === Infinity) {
//       throw new Error("End node not reachable");
//     }

//     // Mark nodes in the shortest path
//     let currentNode: GridNode | null = endNode;
//     while (currentNode) {
//       currentNode.type = "shortestPath";
//       currentNode = currentNode.previousNode;
//     }

//     // Return the shortest path and visited nodes in order
//     const shortestPath: GridNode[] = this.grid
//       .flat()
//       .filter((node) => node.type === "shortestPath");
//     const result = {
//       shortestPath: shortestPath.reverse(),
//       visitedNodesInOrder,
//     };
//     return result;
//   }
// }
// const exampleGrid: Grid = [
//   [
//     {
//       row: 0,
//       col: 0,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 0,
//       col: 1,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 0,
//       col: 2,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 0,
//       col: 3,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 0,
//       col: 4,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//   ],
//   [
//     {
//       row: 1,
//       col: 0,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 1,
//       col: 1,
//       type: "start",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 1,
//       col: 2,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 1,
//       col: 3,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 1,
//       col: 4,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//   ],
//   [
//     {
//       row: 2,
//       col: 0,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 2,
//       col: 1,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 2,
//       col: 2,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 2,
//       col: 3,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 2,
//       col: 4,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//   ],
//   [
//     {
//       row: 3,
//       col: 0,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 3,
//       col: 1,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 3,
//       col: 2,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 3,
//       col: 3,
//       type: "end",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 3,
//       col: 4,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//   ],
//   [
//     {
//       row: 4,
//       col: 0,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 4,
//       col: 1,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 4,
//       col: 2,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 4,
//       col: 3,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//     {
//       row: 4,
//       col: 4,
//       type: "normal",
//       distance: Infinity,
//       previousNode: null,
//     },
//   ],
// ];

// const explorerGraphs = new ExplorerGraphs(exampleGrid);
// const shortestPath = explorerGraphs.dijkstra(1, 1, 3, 3);

// console.log("Grid after Dijkstra's Algorithm:");
// for (const row of explorerGraphs.grid) {
//   console.log(row.map((node) => node.type).join(" "));
// }

// console.log("Shortest Path:");
// console.log(shortestPath);
