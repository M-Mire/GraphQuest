import Navbar from "./SharedUI/Navbar";
import { pageConfigurationEXPLORER as pageConfiguration } from "../_pageConfigs/config";
import useThemeBackground from "../hooks/useThemeBackground";
import { useEffect, useRef, useState } from "react";
import InformationBoard from "./SharedUI/InformationBoard";
import InformationBoardExplorerNode from "./SharedUI/InformationBoardItems/InformationBoardExplorerNode";
import { Grid, GridNode } from "../types";
import ControlAlgorithmButton from "./ExplorerElements/ControlAlgorithmButton";
import { AlgorithmEnum } from "../_pageConfigs/configExplorer";
import { useSearchParams } from "next/navigation";
import CompareBoard from "./ExplorerElements/CompareBoard";
import { renderBoard } from "../utils/renderGridBoard";
import SingleBoard from "./ExplorerElements/SingleBoard";

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
  isCost: false,
};
const END_NODE: GridNode = {
  row: 2,
  col: 2,
  type: "normal",
  isStart: false,
  isEnd: true,
  isBlock: false,
  distance: Infinity,
  gScore: Infinity,
  fScore: Infinity,
  previousNode: null,
  isCost: false,
};

const ExplorerModePage = () => {
  useThemeBackground();

  //States
  const [isPlay, setPlay] = useState<boolean>(false);
  const [startNode, setStartNode] = useState(START_NODE);
  const [endNode, setEndNode] = useState(END_NODE);
  const [board, setBoard] = useState<Grid>(
    renderBoard(startNode, endNode, ROWS, COLS),
  );

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmEnum | null>(null);
  const [isMaze, setMaze] = useState<boolean>(false);
  const nodeRef = useRef<HTMLElement[][]>([]);
  const nodeRef2 = useRef<HTMLElement[][]>([]);
  const searchParams = useSearchParams();

  const mode = searchParams && searchParams.get("compareMode") === "true";
  const [isDeleteClicked, setDeleteClicked] = useState<boolean>(false);

  const [isStatisticButtonOpen, setStatisticButton] = useState<boolean>(false);

  useEffect(() => {
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
            isBlock: false,
            type: "normal",
          };
        }),
      );
      return updatedBoard;
    });
  }, [mode]);

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
          isMaze={isMaze}
          setMaze={setMaze}
          setDeleteClicked={setDeleteClicked}
          isEditMode={mode}
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
            <InformationBoardExplorerNode
              name="Weight"
              nodeClassName="node-weight"
            />
          </InformationBoard>
          {!mode ? (
            <SingleBoard
              isPlay={isPlay}
              setPlay={setPlay}
              startNode={startNode}
              setStartNode={setStartNode}
              endNode={endNode}
              setEndNode={setEndNode}
              isMaze={isMaze}
              setMaze={setMaze}
              nodeRef={nodeRef}
              selectedAlgorithm={selectedAlgorithm}
              isDeleteClicked={isDeleteClicked}
              setDeleteClicked={setDeleteClicked}
              board={board}
              setBoard={setBoard}
            />
          ) : (
            <CompareBoard
              isPlay={isPlay}
              setPlay={setPlay}
              startNode={startNode}
              setStartNode={setStartNode}
              endNode={endNode}
              setEndNode={setEndNode}
              isMaze={isMaze}
              setMaze={setMaze}
              nodeRef={nodeRef}
              nodeRef2={nodeRef2}
              ROWS={ROWS}
              COLS={COLS}
              isDeleteClicked={isDeleteClicked}
              setDeleteClicked={setDeleteClicked}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorerModePage;
