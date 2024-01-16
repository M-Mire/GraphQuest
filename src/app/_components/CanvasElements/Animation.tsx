import React, { useState, useEffect } from "react";
import Canvas from "~/app/_components/CanvasElements/Canvas";
import TraverseCode from "~/app/_components/TraverseAnimation/AnimationCode";
import TraverseAnimationBFS from "~/app/_components/TraverseAnimation/AnimationBFS";
import TraverseAnimationDijkstra from "~/app/_components/TraverseAnimation/AnimationDijkstra";
import TraverseAnimationDFS from "../TraverseAnimation/AnimationDFS";
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

interface AnimationProps {
  nodes: Node[];
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
  provideEdgeLength?: boolean;
  pageID: pageEnum;
  minCanvas: { minHeight: number; minWidth: number };
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
  provideEdgeLength,
  pageID,
  minCanvas,
}) => {
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
    if (rootValue !== null) {
      const g =
        provideEdgeLength === undefined ? new Graph() : new GraphDistance();
      nodes
        .filter((node) => node.childNodes && node.childNodes.length > 0)
        .map((node) => {
          return Array.from(node.childNodes).map((child: number) => {
            if (provideEdgeLength === undefined) {
              if (g instanceof Graph) {
                g.addEdge(node.val, child);
              }
            } else {
              if (g instanceof GraphDistance) {
                // console.log(node);
                // console.log(node.distances);
                // console.log();
                g.addEdgeDistance(
                  node.val,
                  child,
                  node.distances[node.childNodes.indexOf(child)],
                );
              }
            }
          });
        });
      runAlgorithm(g, rootValue);
      // console.log(g.getTracker());
      setTracker(g.getTracker());
    }
  }, [rootValue]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (currentIndex < tracker.length && isPlay) {
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
          nodes={nodes}
          provideEdgeLength={provideEdgeLength}
          minCanvas={minCanvas}
        />
        {pageID === pageEnum.BFS ? (
          <TraverseAnimationBFS nodes={nodes} />
        ) : pageID === pageEnum.DIJKSTRA ? (
          <TraverseAnimationDijkstra
            nodes={nodes}
            currentIndex={currentIndex}
            tracker={tracker}
          />
        ) : pageID === pageEnum.DFS ? (
          <TraverseAnimationDFS
            nodes={nodes}
            currentIndex={currentIndex}
            tracker={tracker}
          />
        ) : null}

        <div className="mx-auto w-2/3 md:absolute md:right-0 md:top-4 md:mr-3 md:h-[calc(100%_-_1.5rem)] md:w-[33%] lg:mr-4 lg:w-[28%]">
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
