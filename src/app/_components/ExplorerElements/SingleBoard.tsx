import { AlgorithmEnum } from "~/app/_pageConfigs/configExplorer";
import { Grid, GridNode, MousePressedNode } from "~/app/types";
import Board from "./Board";
import { useEffect, useState } from "react";
import { renderBoard } from "~/app/utils/renderGridBoard";
import { generateMaze } from "~/app/utils/generateExplorerMaze";

interface SingleBoardProps {
  isPlay: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  startNode: GridNode;
  setStartNode: React.Dispatch<React.SetStateAction<GridNode>>;
  endNode: GridNode;
  setEndNode: React.Dispatch<React.SetStateAction<GridNode>>;
  isMaze: boolean;
  setMaze: React.Dispatch<React.SetStateAction<boolean>>;
  nodeRef: React.MutableRefObject<HTMLElement[][]>;
  selectedAlgorithm: AlgorithmEnum | null;
  isDeleteClicked: boolean;
  setDeleteClicked: React.Dispatch<React.SetStateAction<boolean>>;
  board: Grid;
  setBoard: React.Dispatch<React.SetStateAction<Grid>>;
}

const SingleBoard = ({
  isPlay,
  setPlay,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
  isMaze,
  setMaze,
  nodeRef,
  selectedAlgorithm,
  isDeleteClicked,
  setDeleteClicked,
  board,
  setBoard,
}: SingleBoardProps) => {
  const [isMovedWhilstAnimated, setMovedWhilstAnimated] =
    useState<boolean>(false);

  const [isMousePressed, setMousePressed] = useState<MousePressedNode | null>(
    null,
  );

  useEffect(() => {
    if (!isPlay && isDeleteClicked) {
      setBoard((prevBoard) => {
        const updatedBoard: Grid = prevBoard.map((r) =>
          r.map((n) => {
            const nodeElement = nodeRef.current[n.row]?.[n.col];
            if (nodeElement) {
              nodeElement.classList.remove(
                "node-visited",
                "node-shortest-path",
              );
            }
            return {
              ...n,
              previousNode: null,
              distance: Infinity,
              isBlock: false,
              type: "normal",
            };
          }),
        );
        return updatedBoard;
      });
    }
    setDeleteClicked(false);
  }, [isDeleteClicked]);

  const clearBoard = () => {
    setBoard((prevBoard) => {
      const updatedBoard: Grid = prevBoard.map((r) =>
        r.map((n) => {
          const nodeElement = nodeRef.current[n.row]?.[n.col];
          if (nodeElement) {
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
    if (isMaze) {
      clearBoard();
      setBoard(
        generateMaze(board.length, board[0]!.length, startNode, endNode),
      );
      setMaze(false);
    }
  }, [isMaze]);

  return (
    <Board
      isPlay={isPlay}
      setPlay={setPlay}
      startNode={startNode}
      setStartNode={setStartNode}
      endNode={endNode}
      setEndNode={setEndNode}
      board={board}
      setBoard={setBoard}
      isMovedWhilstAnimated={isMovedWhilstAnimated}
      setMovedWhilstAnimated={setMovedWhilstAnimated}
      selectedAlgorithm={selectedAlgorithm}
      isMaze={isMaze}
      setMaze={setMaze}
      nodeRef={nodeRef}
      isMousePressed={isMousePressed}
      setMousePressed={setMousePressed}
    />
  );
};

export default SingleBoard;
