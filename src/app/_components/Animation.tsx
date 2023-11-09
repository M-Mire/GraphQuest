import React, { useState, useEffect } from "react";
import Canvas from "~/app/_components/Canvas";
import TraverseCode from "~/app/_components/TraverseCode";
import TraverseAnimationBFS from "~/app/_components/traverseAnimation/TraverseAnimationBFS";
import TraverseAnimationDijkstra from "~/app/_components/traverseAnimation/TraverseAnimationDijkstra";
import { Node, ACTIONS_NODE, ActionNode } from "./NodeElement";
import Graph, {
  Command,
  GraphDistance,
  Line,
} from "~/app/_GraphAlgorithm/Graph";
import PseudoCode from "~/app/_components/PseudoCode";

interface CanvasProps {
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

function isCommand(command: Command | Line): command is Command {
  return (command as Command) in Command;
}
export interface ActionLine {
  type: Line;
  payload: number | number[];
}

const Animation: React.FC<CanvasProps> = ({
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
  const [tracker, setTracker] = useState<
    Array<[Command | Line, number | number[] | Map<number, number>]>
  >([]);

  useEffect(() => {
    if (rootValue !== null) {
      const g =
        provideEdgeLength === undefined ? new Graph() : new GraphDistance();
      nodes
        .filter((node) => node.childNodes && node.childNodes.size > 0)
        .map((node) => {
          return Array.from(node.childNodes).map((child: number) => {
            if (provideEdgeLength === undefined) {
              if (g instanceof Graph) {
                g.addEdge(node.val, child);
              }
            } else {
              if (g instanceof GraphDistance) {
                g.addEdgeDistance(node.val, child, node.distances.get(child));
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
        const [command, val] = tracker[currentIndex]! as [
          Command | Line,
          number | number[],
        ];
        if (isCommand(command)) {
          dispatch({
            type: ACTIONS_NODE.NODE_ANIMATE,
            payload: { value: val, command: command },
          });
        } else {
          if (Object.values(Line).includes(command)) {
            dispatchLineNumbers({
              type: command,
              payload: val,
            });
          }
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
