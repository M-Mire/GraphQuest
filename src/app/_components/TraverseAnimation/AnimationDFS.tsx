import React, { useEffect, useRef, useState } from "react";
import { getNodeColour } from "~/app/utils/getNodeColour";
import type Node from "~/app/model/Node";
import { Command } from "~/app/_GraphAlgorithm/Graph";
import type { Line, TrackerArray } from "~/app/_GraphAlgorithm/Graph";

interface TraverseAnimationProps {
  tracker: TrackerArray;
  currentIndex: number;
  nodes: Node[];
}

const TraverseAnimationDFS: React.FC<TraverseAnimationProps> = ({
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
  const [poppedStack, setPoppedStack] = useState<Node | null>();

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
          // If Command.Visited add to the stack
          const copyNode = { ...getNode, visited: true };
          setVisitedNodes([...visitedNodes, copyNode]);
        } else if (command === Command.PoppedStack) {
          //If Command.PoppedStack add to the popped stack

          // Remove the popped value from visited
          const filteredVisited = visitedNodes.filter(
            (node) => node.val !== val,
          );
          setVisitedNodes(filteredVisited);

          //Add to Popped Stack
          const copyNode = { ...getNode, visitedChildrens: true };
          setPoppedStack(copyNode);
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

  const midpointY = containerHeight / 2 - rectHeight / 2;

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ overflowX: "auto" }}
    >
      <svg
        width={totalWidth}
        height={containerHeight}
        className="relative h-full"
      >
        {poppedStack ? (
          <g>
            <rect
              key={`rect-${poppedStack.id}`}
              x={padding}
              y={midpointY}
              width={rectWidth}
              height={rectHeight}
              fill={getNodeColour(
                false,
                poppedStack.visited,
                poppedStack.visitedChildrens,
              )}
              stroke="white"
              strokeWidth={3}
            />
            <text
              key={`text-${poppedStack.id}`}
              x={padding + rectWidth / 2}
              y={midpointY + rectHeight / 2}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white"
            >
              {poppedStack.val}
            </text>
          </g>
        ) : (
          <g>
            <rect
              key={`rect-None`}
              x={padding}
              y={midpointY}
              width={rectWidth}
              height={rectHeight}
              fill="white"
              stroke="white"
              strokeWidth={3}
            />
            <text
              key={`text-None`}
              x={padding + rectWidth / 2}
              y={midpointY + rectHeight / 2}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="black"
            >
              None
            </text>
          </g>
        )}
        <line
          x1={padding / 2 + rectWidth + rectMargin}
          y1={0}
          x2={padding / 2 + rectWidth + rectMargin}
          y2={containerHeight * 5}
          strokeWidth={4}
          stroke="black"
        />
        <text
          x={padding + rectWidth / 2}
          y={32}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="black"
          fontSize={20}
        >
          Popped
        </text>
        <text
          x={rectWidth + rectMargin + padding * 3}
          y={32}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="black"
          fontSize={20}
        >
          Stack
        </text>
        {visitedNodes.map((node, i) => {
          const x = (i + 1) * (rectWidth + rectMargin) + padding;
          const y = midpointY;
          return (
            <g key={`g-visited-${node.id}-${i}`}>
              <rect
                key={`rect-visited-${node.id}`}
                x={x}
                y={y}
                width={rectWidth}
                height={rectHeight}
                fill={getNodeColour(false, node.visited, node.visitedChildrens)}
                stroke="white"
                strokeWidth={3}
              />
              <text
                key={`text-visited-${node.id}`}
                x={x + rectWidth / 2}
                y={y + rectHeight / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="black"
              >
                {node.val}
              </text>
            </g>
          );
        })}
        {!!visitedNodes.length && (
          <>
            <svg
              fill="#000000"
              height="40px"
              width="200px"
              version="1.1"
              id="Layer_1"
              x={
                visitedNodes.length * (rectWidth + rectMargin) +
                padding -
                padding / 3
              }
              y={midpointY + rectHeight / 4}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 330 330"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  id="XMLID_308_"
                  d="M315,150H105V90c0-6.067-3.655-11.537-9.26-13.858c-5.606-2.322-12.058-1.038-16.347,3.252l-75,75 c-5.858,5.858-5.858,15.355,0,21.213l75,75c2.87,2.87,6.705,4.394,10.61,4.394c1.932,0,3.881-0.374,5.737-1.142 c5.605-2.322,9.26-7.791,9.26-13.858v-60h210c8.284,0,15-6.716,15-15C330,156.716,323.284,150,315,150z M75,203.787L36.213,165 L75,126.213V203.787z"
                ></path>
              </g>
            </svg>
            <text
              x={
                visitedNodes.length * (rectWidth + rectMargin) +
                padding +
                rectWidth * 2
              }
              y={midpointY + rectHeight / 2}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="black"
              fontSize={20}
            >
              top
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

export default TraverseAnimationDFS;
