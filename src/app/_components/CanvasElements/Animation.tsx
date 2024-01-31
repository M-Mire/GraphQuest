import React, { useState, useEffect } from "react";
import Canvas from "~/app/_components/CanvasElements/Canvas";
import TraverseCode from "~/app/_components/TraverseAnimation/AnimationCode";
import TraverseAnimationBFS from "~/app/_components/TraverseAnimation/AnimationBFS";
import TraverseAnimationDijkstra from "~/app/_components/TraverseAnimation/AnimationDijkstra";
import TraverseAnimationDFS from "../TraverseAnimation/AnimationDFS";
import AnimationPrims from "../TraverseAnimation/AnimationPrims";
import { ACTIONS_NODE } from "../GraphUI/NodeElement";
import type { ActionNode } from "../GraphUI/NodeElement";
import type Node from "~/app/model/Node";
import Graph, {
  Command,
  GraphDistance,
  Line,
  Order,
} from "~/app/_GraphAlgorithm/Graph";
import type {
  TrackerArray,
  TrackerElementType,
  InstructionType,
  SingleInstruction,
} from "~/app/_GraphAlgorithm/Graph";
import { pageEnum } from "~/app/_pageConfigs/config";
import { useThemeContext } from "~/app/context/ThemeContext";

interface AnimationProps {
  handleNodeReset: () => void;
  nodes: Node[];
  setRootValue: React.Dispatch<React.SetStateAction<number | null>>;
  rootValue: number | null;
  dispatch: React.Dispatch<ActionNode>;
  speed: number;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlay: boolean;
  dispatchLineNumbers: React.Dispatch<ActionLine>;
  lineNumbers: number[];
  runAlgorithm: (g: Graph | GraphDistance, rootValue: number) => void;
  code: string;
  algorithmName: string;
  addEdge: (
    g: Graph | GraphDistance,
    from: number,
    to: number,
    distance?: number,
  ) => void;
  isWeighted: boolean;
  pageID: pageEnum;
  minCanvas: { minHeight: number; minWidth: number };
  isUndirectedGraph: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

function isCommand(type: InstructionType): type is Command {
  return (type as Command) in Command;
}

function isLine(type: InstructionType): type is Line {
  return (type as Line) in Line;
}

function isOrder(type: InstructionType): type is Order {
  return type === Order.Entry;
}

export interface ActionLine {
  type: Line;
  payload: number | Map<number, number> | number[];
}

const Animation: React.FC<AnimationProps> = ({
  handleNodeReset,
  setRootValue,
  nodes,
  rootValue,
  dispatch,
  speed,
  currentIndex,
  setCurrentIndex,
  isPlay,
  dispatchLineNumbers,
  lineNumbers,
  runAlgorithm,
  code,
  algorithmName,
  isWeighted,
  pageID,
  minCanvas,
  isUndirectedGraph,
  setPlay,
}) => {
  const { theme } = useThemeContext();
  const [tracker, setTracker] = useState<TrackerArray>([]);
  const handleSingleCall = (
    Instruction: InstructionType,
    val: TrackerElementType,
  ) => {
    if (isCommand(Instruction)) {
      dispatch({
        type: ACTIONS_NODE.NODE_ANIMATE,
        payload: { value: val, command: Instruction },
      });
    } else if (isLine(Instruction)) {
      dispatchLineNumbers({
        type: Instruction,
        payload: val,
      });
    }
  };

  useEffect(() => {
    if (rootValue !== null && isPlay) {
      handleNodeReset();
      const g = isWeighted === false ? new Graph() : new GraphDistance();
      nodes
        .filter((node) => node.childNodes && node.childNodes.length > 0)
        .map((node) => {
          return Array.from(node.childNodes).map((child: number) => {
            if (isWeighted === false) {
              if (g instanceof Graph) {
                g.addEdge(node.val, child);
              }
            } else {
              if (g instanceof GraphDistance) {
                // console.log(node);
                // console.log(node.distances);
                // console.log();
                if (pageID === pageEnum.DIJKSTRA) {
                  g.addEdgeDistance(
                    node.val,
                    child,
                    node.distances[node.childNodes.indexOf(child)],
                  );
                } else if (pageID === pageEnum.PRIMS_JARNIK) {
                  g.addEdgeCostUndirected(
                    node.val,
                    child,
                    node.distances[node.childNodes.indexOf(child)],
                  );
                } else {
                  console.log("Not a valid PageId in Animation.tsx");
                }
              }
            }
          });
        });
      runAlgorithm(g, rootValue);
      console.log(g.getTracker());
      setTracker(g.getTracker());
    }
  }, [rootValue, isPlay]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (currentIndex < 0) setCurrentIndex(currentIndex + 1);
      if (currentIndex < tracker.length && isPlay) {
        if (tracker[currentIndex] === undefined) {
          return;
        }
        const [command, val] = tracker[currentIndex]!;

        if (isOrder(command)) {
          // Loop through the Command and Line
          const tmp = val as SingleInstruction[];
          for (const [cmd, value] of tmp) {
            handleSingleCall(cmd, value);
          }
        } else {
          //Single call to Command and Line
          handleSingleCall(command, val as TrackerElementType);
        }

        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(timerId);
        setPlay(false);
      }
    }, speed);

    return () => {
      clearInterval(timerId);
    };
  }, [
    tracker,
    currentIndex,
    dispatch,
    isPlay,
    speed,
    handleSingleCall,
    setCurrentIndex,
  ]);

  return (
    <>
      <div className="absolute h-full w-full p-4">
        <Canvas
          isPlay={isPlay}
          rootValue={rootValue}
          setRootValue={setRootValue}
          nodes={nodes}
          isWeighted={isWeighted}
          minCanvas={minCanvas}
          isUndirectedGraph={isUndirectedGraph}
        />
        <div
          className="mt-2 h-1/3 rounded-2xl  border-2 md:h-1/3 md:w-[65%] lg:h-1/3 lg:w-[70%]"
          style={{
            background: theme.background.secondary,
            borderColor: theme.background.quaternary,
          }}
        >
          {pageID === pageEnum.BFS ? (
            <TraverseAnimationBFS nodes={nodes} />
          ) : pageID === pageEnum.DIJKSTRA ? (
            <TraverseAnimationDijkstra
              nodes={nodes}
              currentIndex={currentIndex}
              tracker={tracker}
              isPlay={isPlay}
            />
          ) : pageID === pageEnum.DFS ? (
            <TraverseAnimationDFS
              nodes={nodes}
              currentIndex={currentIndex}
              tracker={tracker}
            />
          ) : pageID === pageEnum.PRIMS_JARNIK ? (
            <AnimationPrims
              nodes={nodes}
              currentIndex={currentIndex}
              tracker={tracker}
              isPlay={isPlay}
            />
          ) : null}
        </div>
        <div
          className="mx-auto w-2/3 md:absolute md:right-0 md:top-4 md:mr-3 md:h-[calc(100%_-_1.5rem)] md:w-[33%] lg:mr-4 lg:w-[28%]"
          style={{ background: theme.background.primary }}
        >
          <TraverseCode
            lineNumbers={lineNumbers}
            code={code}
            algorithmName={algorithmName}
          />
        </div>
      </div>
    </>
  );
};

export default Animation;
