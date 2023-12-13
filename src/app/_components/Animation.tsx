import React, { useState, useEffect } from "react";
import Canvas from "~/app/_components/Canvas";
import TraverseCode from "~/app/_components/TraverseCode";
import TraverseAnimationBFS from "~/app/_components/traverseAnimation/TraverseAnimationBFS";
import TraverseAnimationDijkstra from "~/app/_components/traverseAnimation/TraverseAnimationDijkstra";
import { ACTIONS_NODE, ActionNode } from "./NodeElement";
import Node from "~/app/model/Node";
import Graph, {
  Command,
  GraphDistance,
  Line,
  TrackerArray,
  TrackerElementType,
  InstructionType,
  Order,
  MultipleInstructions,
  SingleInstruction,
} from "~/app/_GraphAlgorithm/Graph";
import PseudoCode from "~/app/_components/PseudoCode";

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
  addEdge,
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
                console.log(node);
                console.log(node.distances);
                console.log();
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
          const tmp = val as Array<SingleInstruction>;
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
  }, [tracker, currentIndex, dispatch, isPlay]);

  return (
    <>
      <div className="relative h-full w-full">
        <Canvas nodes={nodes} provideEdgeLength={provideEdgeLength} />
        {algorithmName === "Breadth-First Search" ? (
          <TraverseAnimationBFS nodes={nodes} />
        ) : algorithmName === "Dijkstra Algorithm" ? (
          <TraverseAnimationDijkstra
            nodes={nodes}
            currentIndex={currentIndex}
            tracker={tracker}
          />
        ) : null}

        <div className="over absolute right-0 top-0 h-full w-1/4">
          <TraverseCode
            lineNumbers={lineNumbers}
            code={code}
            algorithmName={algorithmName}
          />
          <PseudoCode />
        </div>
      </div>
    </>
  );
};

export default Animation;
