import type { Grid, GridNode, NodeType } from "../types";

export const renderBoard = (
  startNode: { row: number; col: number },
  endNode: { row: number; col: number },
  ROWS: number,
  COLS: number,
): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < ROWS; i++) {
    const row: GridNode[] = [];
    for (let j = 0; j < COLS; j++) {
      const isStartNode = startNode.row === i && startNode.col === j;
      const isEndNode = endNode.row === i && endNode.col === j;

      const nodeType: NodeType = "normal";

      row.push({
        row: i,
        col: j,
        type: nodeType,
        isStart: isStartNode,
        isEnd: isEndNode,
        distance: Infinity,
        gScore: Infinity,
        fScore: Infinity,
        isBlock: false,
        previousNode: null,
      });
    }
    grid.push(row);
  }
  return grid;
};
