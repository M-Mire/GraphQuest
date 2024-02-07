import React, { useState, useEffect, useRef } from "react";
import type { Grid, GridNode, MousePressedNode } from "../../types";
import ExplorerGraph from "~/app/ExplorersAlgorithm/ExplorerAlgorithm";
import Node from "./Node";
import { useThemeContext } from "~/app/context/ThemeContext";
import { AlgorithmEnum } from "~/app/_pageConfigs/configExplorer";

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
  selectedAlgorithm: AlgorithmEnum | null;
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
  selectedAlgorithm,
}: BoardProps) => {
  const { theme } = useThemeContext();
  const [isMousePressed, setMousePressed] = useState<MousePressedNode | null>(
    null,
  );
  const [lastBlockEdited, setLastBlockEdited] = useState<GridNode | null>(null);
  const [isAnimated, setAnimated] = useState<boolean>(false);
  const nodeRef = useRef<HTMLElement[][]>([]);

  const ANIMATION_SPEED = 30;

  const animateDijkstra = async () => {
    const newBoard: Grid = board.map((row) =>
      row.map((node) => {
        return {
          ...node,
          previousNode: null,
          distance: Infinity,
          type: "normal",
        };
      }),
    );
    try {
      const { shortestPath, visitedNodesInOrder } =
        ExplorerGraph.executeAlgorithm(
          selectedAlgorithm,
          startNode.row,
          startNode.col,
          endNode.row,
          endNode.col,
          newBoard,
        );

      // Animate visited nodes
      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        const node = visitedNodesInOrder[i]!;
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            nodeRef.current[node.row]?.[node.col]?.classList.add(
              "node-visited",
            );
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
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          nodeRef.current[node.row]?.[node.col]?.classList.add(
            "node-shortest-path",
          );
          resolve();
        }, ANIMATION_SPEED);
      });
    }
  };

  const clearBoard = () => {
    setBoard((prevBoard) => {
      const updatedBoard: Grid = prevBoard.map((r) =>
        r.map((n) => {
          const nodeElement = nodeRef.current[n.row]?.[n.col];
          if (nodeElement) {
            // Reset classes
            nodeElement.classList.remove("node-visited", "node-shortest-path");
          }
          return {
            ...n,
            previousNode: null,
            distance: Infinity,
            type: "normal",
          };
        }),
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
        selectedAlgorithm,
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

  useEffect(() => {
    clearBoard();
  }, [selectedAlgorithm]);

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
                  isMovedWhilstAnimated={isMovedWhilstAnimated}
                  ref={(el) => {
                    nodeRef.current[i] = nodeRef.current[i] ?? [];
                    nodeRef.current[i]![j] = el!;
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
