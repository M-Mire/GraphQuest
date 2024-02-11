import { AlgorithmEnum } from "~/app/_pageConfigs/configExplorer";
import { Grid, GridNode, MousePressedNode } from "~/app/types";
import Board from "./Board";
import { useEffect, useState } from "react";
import { renderBoard } from "~/app/utils/renderGridBoard";
import { generateMaze } from "~/app/utils/generateExplorerMaze";

interface CompareBoardProps {
  isPlay: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  startNode: GridNode;
  setStartNode: React.Dispatch<React.SetStateAction<GridNode>>;
  endNode: GridNode;
  setEndNode: React.Dispatch<React.SetStateAction<GridNode>>;
  isMaze: boolean;
  setMaze: React.Dispatch<React.SetStateAction<boolean>>;
  nodeRef: React.MutableRefObject<HTMLElement[][]>;
  nodeRef2: React.MutableRefObject<HTMLElement[][]>;
  ROWS: number;
  COLS: number;
  isDeleteClicked: boolean;
  setDeleteClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompareBoard = ({
  isPlay,
  setPlay,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
  isMaze,
  setMaze,
  nodeRef,
  nodeRef2,
  ROWS,
  COLS,
  isDeleteClicked,
  setDeleteClicked,
}: CompareBoardProps) => {
  const [selectedAlg1, setSelectedAlgorithm1] = useState<AlgorithmEnum | null>(
    null,
  );
  const [selectedAlg2, setSelectedAlgorithm2] = useState<AlgorithmEnum | null>(
    null,
  );
  const [board1, setBoard1] = useState<Grid>(
    renderBoard(startNode, endNode, ROWS, COLS),
  );
  const [board2, setBoard2] = useState<Grid>(
    renderBoard(startNode, endNode, ROWS, COLS),
  );

  const [isMovedWhilstAnimated, setMovedWhilstAnimated] =
    useState<boolean>(false);

  const [isMousePressed, setMousePressed] = useState<MousePressedNode | null>(
    null,
  );
  const [isPlay1, setPlay1] = useState<boolean>(false);
  const [isPlay2, setPlay2] = useState<boolean>(false);

  useEffect(() => {
    if (isPlay && !isPlay1 && !isPlay2) {
      setPlay1(true);
      setPlay2(true);
      setPlay(false);
    }
  }, [isPlay, isPlay1, isPlay2]);

  useEffect(() => {
    if (!isPlay1 && !isPlay2 && isDeleteClicked) {
      setBoard1((prevBoard) => {
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
      setBoard2((prevBoard) => {
        const updatedBoard: Grid = prevBoard.map((r) =>
          r.map((n) => {
            const nodeElement = nodeRef2.current[n.row]?.[n.col];
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
    setBoard1((prevBoard) => {
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
    setBoard2((prevBoard) => {
      const updatedBoard: Grid = prevBoard.map((r) =>
        r.map((n) => {
          const nodeElement = nodeRef2.current[n.row]?.[n.col];
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
    if (isMaze) {
      clearBoard();
      const newBoard = generateMaze(ROWS, COLS, startNode, endNode);
      setBoard1(newBoard);
      setBoard2(newBoard);
      setMaze(false);
    }
  }, [isMaze]);

  return (
    <div className="flex justify-center gap-4">
      <Board
        testName="board1"
        isPlay={isPlay1}
        setPlay={setPlay1}
        isOtherPlay={isPlay2}
        setOtherBoard={setBoard2}
        startNode={startNode}
        setStartNode={setStartNode}
        endNode={endNode}
        setEndNode={setEndNode}
        board={board1}
        setBoard={setBoard1}
        isMovedWhilstAnimated={isMovedWhilstAnimated}
        setMovedWhilstAnimated={setMovedWhilstAnimated}
        selectedAlgorithm={selectedAlg1}
        isMaze={isMaze}
        setMaze={setMaze}
        nodeRef={nodeRef}
        isMousePressed={isMousePressed}
        setMousePressed={setMousePressed}
        setSelectedAlgorithm={setSelectedAlgorithm1}
      />
      <div className="h-full border-l border-gray-500"></div>
      <Board
        testName="board2"
        isPlay={isPlay2}
        setPlay={setPlay2}
        isOtherPlay={isPlay1}
        setOtherBoard={setBoard1}
        startNode={startNode}
        setStartNode={setStartNode}
        endNode={endNode}
        setEndNode={setEndNode}
        board={board2}
        setBoard={setBoard2}
        isMovedWhilstAnimated={isMovedWhilstAnimated}
        setMovedWhilstAnimated={setMovedWhilstAnimated}
        selectedAlgorithm={selectedAlg2}
        isMaze={isMaze}
        setMaze={setMaze}
        nodeRef={nodeRef2}
        isMousePressed={isMousePressed}
        setMousePressed={setMousePressed}
        setSelectedAlgorithm={setSelectedAlgorithm2}
      />
    </div>
  );
};

export default CompareBoard;
