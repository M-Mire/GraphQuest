import Navbar from "./SharedUI/Navbar";
import { pageConfigurationBFS as pageConfiguration } from "../_pageConfigs/config";
import useThemeBackground from "../hooks/useThemeBackground";
import Board from "./ExplorerElements/Board";
import { useState } from "react";
import InformationBoard from "./SharedUI/InformationBoard";
import InformationBoardExplorerNode from "./SharedUI/InformationBoardItems/InformationBoardExplorerNode";

const ExplorerModePage = () => {
  useThemeBackground();

  //States
  const [isPlay, setPlay] = useState<boolean>(false);

  return (
    <div className="relative flex h-screen flex-col">
      <Navbar
        algorithmName="Explorer's Mode"
        pageConfiguration={pageConfiguration}
      >
        <button
          className={`bg-yellow-400 text-red-500 ${
            isPlay ? "cursor-not-allowed" : ""
          }`}
          onClick={() => {
            setPlay(true);
          }}
        >
          {!isPlay ? "click me" : "playing"}
        </button>
      </Navbar>
      <div className=" flex w-full justify-center">
        <div className="my-2 mt-[50px] overflow-auto rounded-2xl border-2 ">
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
          <Board isPlay={isPlay} setPlay={setPlay} />
        </div>
      </div>
    </div>
  );
};

export default ExplorerModePage;
