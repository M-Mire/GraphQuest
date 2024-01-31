import React, { useState, useEffect, memo, useCallback } from "react";
import { NodeType, Grid, GridNode } from "../../types";
import ExplorerGraph from "../../ExplorersAlgorithm/dijkstra";
import Node from "./Node";
import { useThemeContext } from "~/app/context/ThemeContext";
const ROWS = 15;
const COLS = 40;
const START_NODE: GridNode = {
  row: 10,
  col: 10,
  type: "start",
  isBlock: false,
  distance: Infinity,
  previousNode: null,
};
const END_NODE: GridNode = {
  row: 10,
  col: 15,
  type: "end",
  isBlock: false,
  distance: Infinity,
  previousNode: null,
};

const renderBoard = (
  startNode: { row: number; col: number },
  endNode: { row: number; col: number },
): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < ROWS; i++) {
    const row: GridNode[] = [];
    for (let j = 0; j < COLS; j++) {
      const isStartNode = startNode.row === i && startNode.col === j;
      const isEndNode = endNode.row === i && endNode.col === j;

      let nodeType: NodeType = "normal";
      if (isStartNode) {
        nodeType = "start";
      } else if (isEndNode) {
        nodeType = "end";
      }
      row.push({
        row: i,
        col: j,
        type: nodeType,
        distance: Infinity,
        isBlock: false,
        previousNode: null,
      });
    }
    grid.push(row);
  }
  return grid;
};

interface BoardProps {
  isPlay: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
}
const Board = ({ isPlay, setPlay }: BoardProps) => {
  const { theme } = useThemeContext();
  const [startNode, setStartNode] = useState(START_NODE);
  const [endNode, setEndNode] = useState(END_NODE);
  const [board, setBoard] = useState<Grid>(renderBoard(startNode, endNode));
  const [isMousePressed, setMousePressed] = useState<NodeType | null>(null);
  const [lastBlockEdited, setLastBlockEdited] = useState<GridNode | null>(null);
  const [isAnimated, setAnimated] = useState<boolean>(false);
  const ANIMATION_SPEED = 20;

  const animateDijkstra = async () => {
    const explorerGraphs = new ExplorerGraph(board);

    try {
      const { shortestPath, visitedNodesInOrder } = explorerGraphs.dijkstra(
        startNode.row,
        startNode.col,
        endNode.row,
        endNode.col,
      );

      // Animate visited nodes
      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        const node = visitedNodesInOrder[i]!;

        // console.log(`Visited Node: ${node.row}-${node.col} (${node.type})`);

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            setBoard((prevBoard) => {
              const updatedBoard = prevBoard.map((row) =>
                row.map((n) => ({ ...n })),
              );
              updatedBoard[node.row]![node.col]!.type = "visited";
              return updatedBoard;
            });
            resolve();
          }, ANIMATION_SPEED);
        });

        if (i === visitedNodesInOrder.length - 1) {
          await animateShortestPath(shortestPath).catch((error) => {
            console.error("Animation error:", error);
          });
        }
      }
    } catch {
    } finally {
      setPlay(false);
    }
  };
  const animateShortestPath = async (shortestPath: GridNode[]) => {
    for (const node of shortestPath) {
      // console.log(`Shortest Node: ${node.row}-${node.col} (${node.type})`);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setBoard((prevBoard) => {
            const updatedBoard = prevBoard.map((row) =>
              row.map((node) => ({ ...node })),
            );
            updatedBoard[node.row]![node.col]!.type = "shortestPath";
            return updatedBoard;
          });
          resolve();
        }, ANIMATION_SPEED);
      });
    }
  };

  const clearBoard = () => {
    setAnimated(false);
    setBoard((prevBoard) => {
      const updatedBoard: Grid = prevBoard.map((r) =>
        r.map((n) => {
          if (n.row === startNode.row && n.col === startNode.col) {
            return {
              ...n,
              type: "start",
              previousNode: null,
              distance: Infinity,
            };
          } else if (n.row === endNode.row && n.col === endNode.col) {
            return {
              ...n,
              type: "end",
              previousNode: null,
              distance: Infinity,
            };
          } else if (n.type === "shortestPath" || n.type === "visited") {
            return {
              ...n,
              type: "normal",
              previousNode: null,
              distance: Infinity,
            } as GridNode;
          }
          return { ...n, previousNode: null, distance: Infinity };
        }),
      );
      return updatedBoard;
    });
  };

  useEffect(() => {
    const runAnimation = async () => {
      if (isPlay) {
        clearBoard();
        await animateDijkstra();
      }
      setAnimated(true);
    };

    runAnimation().catch((error) => {
      console.error("Animation error:", error);
    });
  }, [isPlay, isMousePressed]);

  const handleMouseDown = (row: number, col: number) => {
    if (isPlay) return;
    const currentNode = board[row]![col]!;
    let nodeType = currentNode.type;

    if (currentNode.type === "shortestPath" && isAnimated) {
      if (
        currentNode.row === startNode.row &&
        currentNode.col === startNode.col
      ) {
        nodeType = "start";
      }
    }
    setMousePressed(nodeType);
  };

  const handleMouseMove = (row: number, col: number) => {
    if (!isMousePressed || isPlay) return;

    const newBoard = [...board];

    const currentNode = newBoard[row]![col]!;

    if (isMousePressed === "start" && currentNode.type !== "end") {
      newBoard[startNode.row]![startNode.col]!.type = "normal";

      setStartNode({
        row: row,
        col: col,
        type: "start",
        isBlock: false,
        distance: Infinity,
        previousNode: null,
      });
      newBoard[row]![col]!.type = "start";
    } else if (isMousePressed === "end" && currentNode.type !== "start") {
      newBoard[endNode.row]![endNode.col]!.type = "normal";
      setEndNode({
        row: row,
        col: col,
        type: "end",
        isBlock: false,
        distance: Infinity,
        previousNode: null,
      });

      newBoard[row]![col]!.type = "end";
    } else if (
      (isMousePressed === "normal" ||
        isMousePressed === "visited" ||
        isMousePressed === "shortestPath") &&
      (startNode.row !== row || startNode.col !== col) &&
      (endNode.row !== row || endNode.col !== col)
    ) {
      if (
        !lastBlockEdited ||
        lastBlockEdited.row !== row ||
        lastBlockEdited.col !== col
      ) {
        const isBlock = newBoard[row]![col]!.isBlock;
        newBoard[row]![col]!.isBlock = !isBlock;

        setLastBlockEdited({
          row,
          col,
          type: newBoard[row]![col]!.type,
          isBlock: newBoard[row]![col]!.isBlock,
          distance: Infinity,
          previousNode: null,
        });
      }
    }

    setBoard(newBoard);
  };

  const handleMouseUp = () => {
    setMousePressed(null);
  };

  const renderGrid = () => {
    return (
      <div
        className="overflow-hidden"
        style={{
          background: theme.background.secondary,
          borderColor: theme.background.quaternary,
        }}
      >
        {board.map((row, i) => {
          return (
            <div key={i} className="flex justify-center">
              {row.map((node, j) => {
                return (
                  <Node
                    key={`${i}-${j}`}
                    node={node}
                    startNode={startNode}
                    endNode={endNode}
                    handleMouseDown={(row: number, col: number) =>
                      handleMouseDown(row, col)
                    }
                    handleMouseMove={(row: number, col: number) =>
                      handleMouseMove(row, col)
                    }
                    handleMouseUp={handleMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return <div>{renderGrid()}</div>;
};

export default Board;
