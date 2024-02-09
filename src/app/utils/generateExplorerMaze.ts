import { Grid, GridNode } from "../types";

export const generateMaze = (
  rows: number,
  cols: number,
  startNode: GridNode,
  endNode: GridNode,
): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    const row: GridNode[] = [];
    for (let j = 0; j < cols; j++) {
      const isStartNode = startNode.row === i && startNode.col === j;
      const isEndNode = endNode.row === i && endNode.col === j;
      row.push({
        row: i,
        col: j,
        type: "normal",
        isStart: isStartNode,
        isEnd: isEndNode,
        isBlock: true,
        distance: Infinity,
        gScore: Infinity,
        fScore: Infinity,
        previousNode: null,
      });
    }
    grid.push(row);
  }

  const carvePath = (row: number, col: number) => {
    grid[row]![col]!.isBlock = false;
    const directions: [number, number][] = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];

    // shuffle why is typescript annoying like this...
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp: [number, number] = directions[i]!;
      directions[i] = directions[j]!;
      directions[j] = temp;
    }

    for (const [dx, dy] of directions) {
      const newRow = row + dx * 2;
      const newCol = col + dy * 2;
      const newNode = grid[newRow]?.[newCol];
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !!newNode &&
        newNode.isBlock
      ) {
        grid[row + dx]![col + dy]!.isBlock = false;
        carvePath(newRow, newCol);
      }
    }
  };

  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  carvePath(startRow, startCol);

  return grid;
};
