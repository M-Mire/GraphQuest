import React, { useEffect, useRef, useState } from "react";
import { COLOUR_SELECTION } from "~/app/_components/GraphUI/NodeElement";
import type Node from "~/app/model/Node";
import { Command } from "~/app/_GraphAlgorithm/Graph";
import type { Line, TrackerArray } from "~/app/_GraphAlgorithm/Graph";
import newNode from "~/app/utils/createNewNode";

interface TraverseAnimationProps {
  tracker: TrackerArray;
  currentIndex: number;
  nodes: Node[];
}

const TraverseAnimationPrims: React.FC<TraverseAnimationProps> = ({
  nodes,
  currentIndex,
  tracker,
}) => {
  const rectHeight = 80;
  const rectWidth = 70;
  const rectMargin = 20;
  const padding = 20;

  const totalWidth =
    (rectWidth + rectMargin + padding) * (nodes.length + 1) + 4 * padding;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [previousCost, setPrevCost] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(400);

  useEffect(() => {
    if (
      currentIndex >= 0 &&
      currentIndex < tracker.length &&
      tracker[currentIndex]
    ) {
      const [command, val] = tracker[currentIndex] as [
        Command | Line,
        number | number[] | Map<number, number>,
      ];
      if (command as Command) {
        const getNode = nodes.find((node) => node.val === val)!;
        if (command === Command.Visited) {
          getNode.visited = true;
          setVisitedNodes([...visitedNodes, getNode]);

          if (previousCost !== null) {
            setCurrentWeight(currentWeight + previousCost);
            setPrevCost(null);
          }
        }
        if (command === Command.VisitPairs) {
          const [val1, val2] = val as [number, number];
          const getVal1 = nodes.find((node) => node.val === val1);
          const getVal2 = nodes.find((node) => node.val === val2);

          const flag1 = getVal1?.distances[getVal1.childNodes.indexOf(val2)];
          const flag2 = getVal2?.distances[getVal2.childNodes.indexOf(val1)];
          if (flag2 !== undefined) {
            setPrevCost(flag2);
          } else if (flag1 !== undefined) {
            setPrevCost(flag1);
          } else {
            console.log("Animation current weight incorrect");
          }

          //   getVal1.distances[node.childNodes.indexOf(childVal)]
        }
      }
    }
  }, [currentIndex, tracker]);

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setContainerHeight(height);
      }
    };
    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
    return () => {
      window.removeEventListener("resize", updateContainerHeight);
    };
  }, []);
  const lineX = padding + rectWidth + (rectWidth + rectMargin) / 2;
  return (
    <div
      ref={containerRef}
      className="mt-2 h-1/3 rounded-2xl bg-slate-500 md:h-1/3 md:w-[65%] lg:h-1/3 lg:w-[70%]"
      style={{ overflowX: "auto" }}
    >
      <svg
        width={totalWidth}
        height={containerHeight}
        className="relative h-full"
      >
        <g key={`group-total-weight`}>
          <text
            x={rectWidth}
            y={26}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="black"
            fontSize={20}
          >
            Total Weight
          </text>
          <rect
            x={(lineX - rectWidth) / 2}
            y={rectHeight / 2 + 5}
            width={rectWidth}
            height={rectHeight}
            fill="green"
            stroke="white"
            strokeWidth={3}
          />
          <text
            x={lineX / 2}
            y={rectHeight + 5}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
            key={`text-none`}
          >
            {currentWeight}
          </text>
        </g>
        <line
          x1={lineX}
          y1={0}
          x2={lineX}
          y2={containerHeight * 5}
          strokeWidth={4}
          stroke="black"
        />

        <text
          x={lineX + rectWidth / 2 + rectMargin}
          y={26}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="black"
          fontSize={20}
        >
          Visited
        </text>

        {!!visitedNodes.length && (
          <>
            {visitedNodes.map((node, i) => {
              const x = i * (rectWidth + rectMargin) + lineX + padding;
              const y = rectHeight / 2;
              return (
                <g key={`group-${node.val}-${i}`}>
                  <rect
                    x={x}
                    y={y + 5}
                    width={rectWidth}
                    height={rectHeight}
                    fill={COLOUR_SELECTION(
                      false,
                      node.visited,
                      node.visitedChildrens,
                    )}
                    stroke="white"
                    strokeWidth={3}
                  />
                  <text
                    x={x + rectWidth / 2}
                    y={y + 5 + rectHeight / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill="white"
                    key={`text-${node.val}-${i}`}
                  >
                    {node.val}
                  </text>
                </g>
              );
            })}
          </>
        )}
      </svg>
    </div>
  );
};

export default TraverseAnimationPrims;
