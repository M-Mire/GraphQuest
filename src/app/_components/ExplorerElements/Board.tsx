import React, { useState, useEffect, useRef } from "react";
import type { Grid, GridNode, MousePressedNode } from "../../types";
import ExplorerGraph from "~/app/ExplorersAlgorithm/ExplorerAlgorithm";
import Node from "./Node";
import { useThemeContext } from "~/app/context/ThemeContext";
import type { ExploreAlgorithmsType } from "../../types";

interface BoardProps {
  isPlay: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  startNode: GridNode;
  setStartNode: React.Dispatch<React.SetStateAction<GridNode>>;
  endNode: GridNode;
  setEndNode: React.Dispatch<React.SetStateAction<GridNode>>;
  board: Grid;
  setBoard: React.Dispatch<React.SetStateAction<Grid>>;
  isMovedWhilstAnimated: boolean;
  setMovedWhilstAnimated: React.Dispatch<React.SetStateAction<boolean>>;
  ALGORITHM: string;
}
const Board = ({
  isPlay,
  setPlay,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
  board,
  setBoard,
  isMovedWhilstAnimated,
  setMovedWhilstAnimated,
  ALGORITHM,
}: BoardProps) => {
  const { theme } = useThemeContext();
  const [isMousePressed, setMousePressed] = useState<MousePressedNode | null>(
    null,
  );
  const [lastBlockEdited, setLastBlockEdited] = useState<GridNode | null>(null);
  const [isAnimated, setAnimated] = useState<boolean>(false);
  // let nodeRef = useRef(null);

  const ANIMATION_SPEED = 30;

  const animateDijkstra = async () => {
    const newBoard: Grid = board.map((row) =>
      row.map((node) => {
        console.log;
        return {
          ...node,
          previousNode: null,
          distance: Infinity,
          type: "normal",
        };
      }),
    );
    const explorerGraphs = new ExplorerGraph(newBoard);
    try {
      const { shortestPath, visitedNodesInOrder } =
        ExplorerGraph.executeAlgorithm(
          ALGORITHM,
          startNode.row,
          startNode.col,
          endNode.row,
          endNode.col,
          newBoard,
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
    setBoard((prevBoard) => {
      const updatedBoard: Grid = prevBoard.map((r) =>
        r.map((n) => {
          return {
            ...n,
            previousNode: null,
            distance: Infinity,
            type: "normal",
          };
        }),
      );
      console.log(
        "updated ",
        updatedBoard.flat().filter((node) => node.type !== "normal"),
      );
      return updatedBoard;
    });
  };

  useEffect(() => {
    const runAnimation = async () => {
      if (isPlay) {
        setMovedWhilstAnimated(false);
        setAnimated(false);
        clearBoard();
        await animateDijkstra();
        setAnimated(true);
      }
    };

    if (
      isAnimated &&
      (isMousePressed === "start" || isMousePressed === "end")
    ) {
      setMovedWhilstAnimated(true);
      const newBoard: Grid = board.map((row) =>
        row.map((node) => {
          console.log;
          return {
            ...node,
            previousNode: null,
            distance: Infinity,
            type: "normal",
          };
        }),
      );
      const updatedBoard = ExplorerGraph.executeInstantAlgorithm(
        ALGORITHM,
        startNode.row,
        startNode.col,
        endNode.row,
        endNode.col,
        newBoard,
      );
      setBoard(updatedBoard);
    }

    runAnimation().catch((error) => {
      console.error("Animation error:", error);
    });
  }, [isPlay, isMousePressed, startNode, endNode]);

  const handleMouseDown = (row: number, col: number) => {
    if (isPlay) return;
    const currentNode = board[row]![col]!;
    const isStartNode = startNode.row === row && startNode.col === col;
    const isEndNode = endNode.row === row && endNode.col === col;
    const nodeType = isStartNode
      ? "start"
      : isEndNode
      ? "end"
      : ("normal" as MousePressedNode);
    setMousePressed(nodeType);
  };

  const handleMouseMove = (row: number, col: number) => {
    if (!isMousePressed || isPlay) return;

    const newBoard = [...board];

    if (isMousePressed === "start") {
      if (row !== startNode.row || col !== startNode.col) {
        // console.log(nodeRef.current, "parent");
        console.log(row, col);
        // trying to prevent unnecessary renders
        newBoard[startNode.row]![startNode.col]!.isStart = false;
        newBoard[row]![col]!.isStart = true;
        setStartNode({ ...startNode, row, col });
      }
    } else if (isMousePressed === "end") {
      if (row !== endNode.row || col !== endNode.col) {
        newBoard[endNode.row]![endNode.col]!.isEnd = false;
        newBoard[row]![col]!.isEnd = true;
        setEndNode({ ...endNode, row, col });
      }
    } else {
      console.log(isMousePressed);
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
          isBlock: !isBlock,
          type: "normal",
          isStart: startNode.row === row && startNode.col === col,
          isEnd: endNode.row === row && endNode.col === col,
          previousNode: null,
          distance: Infinity,
          gScore: Infinity,
          fScore: Infinity,
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
                    // forwardedRef={nodeRef}
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
                    isMovedWhilstAnimated={isMovedWhilstAnimated}
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
