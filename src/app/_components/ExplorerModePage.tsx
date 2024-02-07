import Navbar from "./SharedUI/Navbar";
import { pageConfigurationBFS as pageConfiguration } from "../_pageConfigs/config";
import useThemeBackground from "../hooks/useThemeBackground";
import Board from "./ExplorerElements/Board";
import { useState } from "react";
import InformationBoard from "./SharedUI/InformationBoard";
import InformationBoardExplorerNode from "./SharedUI/InformationBoardItems/InformationBoardExplorerNode";
import { Grid, GridNode, NodeType } from "../types";
import ControlAlgorithmButton from "./ExplorerElements/ControlAlgorithmButton";
import { AlgorithmEnum, algorithmMap } from "../_pageConfigs/configExplorer";

const ROWS = 15;
const COLS = 40;
const START_NODE: GridNode = {
  row: 0,
  col: 0,
  type: "normal",
  isStart: true,
  isEnd: false,
  isBlock: false,
  distance: Infinity,
  gScore: Infinity,
  fScore: Infinity,
  previousNode: null,
};
const END_NODE: GridNode = {
  row: 5,
  col: 10,
  type: "normal",
  isStart: false,
  isEnd: true,
  isBlock: false,
  distance: Infinity,
  gScore: Infinity,
  fScore: Infinity,
  previousNode: null,
};

const ExplorerModePage = () => {
  useThemeBackground();

  //States
  const [isPlay, setPlay] = useState<boolean>(false);
  const [startNode, setStartNode] = useState(START_NODE);
  const [endNode, setEndNode] = useState(END_NODE);
  const [board, setBoard] = useState<Grid>(renderBoard(startNode, endNode));
  const [isMovedWhilstAnimated, setMovedWhilstAnimated] =
    useState<boolean>(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmEnum | null>(null);

  return (
    <div className="relative flex h-screen flex-col">
      <Navbar
        algorithmName="Explorer's Mode"
        pageConfiguration={pageConfiguration}
      >
        <ControlAlgorithmButton
          isPlay={isPlay}
          setPlay={setPlay}
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={setSelectedAlgorithm}
        />
      </Navbar>
      <div className="flex w-full justify-center">
        <div className="bg-red my-2 mt-[50px] overflow-auto rounded-2xl border-2">
          <InformationBoard>
            <InformationBoardExplorerNode
              name="Start Node"
              nodeClassName="node-start-green"
            />
            <InformationBoardExplorerNode
              name="End Node"
              nodeClassName="node-end-red"
            />
            <InformationBoardExplorerNode
              name="Visited"
              nodeClassName="node-visited"
            />
            <InformationBoardExplorerNode
              name="Shortest Path"
              nodeClassName="node-shortest-path"
            />
            <InformationBoardExplorerNode
              name="Block"
              nodeClassName="node-block"
            />
          </InformationBoard>
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
          />
          {/* <div className="flex justify-center gap-4">
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
            />
            <div className="h-full border-l border-gray-500"></div>
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
            />
          </div> */}
        </div>
      </div>
    </div>
  );
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
export default ExplorerModePage;
