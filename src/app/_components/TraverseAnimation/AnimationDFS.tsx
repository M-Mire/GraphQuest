import React, { useEffect, useRef, useState, useCallback } from "react";
import type Node from "~/app/model/Node";
import { Command } from "~/app/_GraphAlgorithm/Graph";
import type { Line, TrackerArray } from "~/app/_GraphAlgorithm/Graph";
import { useSearchParams } from "next/navigation";
import convertToLetter from "~/app/utils/convertToLetter";

interface TraverseAnimationProps {
  tracker: TrackerArray;
  currentIndex: number;
  nodes: Node[];
}

const rectDimensions = { height: 80, width: 70, margin: 20 };
const padding = 20;

const TraverseAnimationDFS: React.FC<TraverseAnimationProps> = ({
  nodes,
  currentIndex,
  tracker,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);
  const [poppedStack, setPoppedStack] = useState<Node | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(400);
  const searchParams = useSearchParams();
  const isLetter = searchParams?.get("lettered") === "true";

  const totalWidth =
    (rectDimensions.width + rectDimensions.margin + padding) *
      (nodes.length + 1) +
    4 * padding;

  const midpointY = containerHeight / 2 - rectDimensions.height / 2;

  const updateContainerHeight = useCallback(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  const handleTrackerUpdate = useCallback(
    ([command, val]: [
      Command | Line,
      number | number[] | Map<number, number>,
    ]) => {
      const node = nodes.find((node) => node.val === val);
      if (!node) return;

      if (command === Command.Visited) {
        if (!visitedNodes.some((visitedNode) => visitedNode.val === node.val)) {
          setVisitedNodes((prev) => [...prev, { ...node, visited: true }]);
        }
      } else if (command === Command.PoppedStack) {
        setVisitedNodes((prev) =>
          prev.filter((visitedNode) => visitedNode.val !== node.val),
        );
        setPoppedStack({ ...node, visitedChildrens: true });
      }
    },
    [nodes, visitedNodes],
  );

  useEffect(() => {
    if (currentIndex === -1) {
      setVisitedNodes([]);
      setPoppedStack(null);
      return;
    }
    if (
      currentIndex >= 0 &&
      currentIndex < tracker.length &&
      tracker[currentIndex] !== undefined
    ) {
      handleTrackerUpdate(
        tracker[currentIndex] as [
          Command | Line,
          number | number[] | Map<number, number>,
        ],
      );
    }
  }, [currentIndex, tracker, handleTrackerUpdate]);

  useEffect(() => {
    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
    return () => {
      window.removeEventListener("resize", updateContainerHeight);
    };
  }, [updateContainerHeight]);

  const placeholderNode: Node = {
    id: "None",
    val: -1,
    x: 0,
    y: 0,
    visited: false,
    visitedChildrens: false,
    childNodes: [],
    distances: [],
    connectedTo: [],
  };

  const renderNode = (node: Node, x: number, isPopped: boolean = false) => (
    <g key={`node-${node.id}`}>
      <rect
        x={x}
        y={midpointY}
        width={rectDimensions.width}
        height={rectDimensions.height}
        className={`stroke-secondary ${
          isPopped ? "fill-green-500" : "fill-primary"
        }`}
        strokeWidth={3}
      />
      <text
        x={x + rectDimensions.width / 2}
        y={midpointY + rectDimensions.height / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="var(--foreground)"
      >
        {isLetter ? convertToLetter(node.val) : node.val}
      </text>
    </g>
  );

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
        {renderNode(poppedStack || placeholderNode, padding, !!poppedStack)}

        <line
          x1={padding / 2 + rectDimensions.width + rectDimensions.margin}
          y1={0}
          x2={padding / 2 + rectDimensions.width + rectDimensions.margin}
          y2={containerHeight * 5}
          strokeWidth={4}
          className="stroke-tertiary"
        />

        <text
          x={padding + rectDimensions.width / 2}
          y={32}
          textAnchor="middle"
          alignmentBaseline="middle"
          className="fill-primary"
          fontSize={20}
        >
          Popped
        </text>

        <text
          x={rectDimensions.width + rectDimensions.margin + padding * 3}
          y={32}
          textAnchor="middle"
          alignmentBaseline="middle"
          className="fill-primary"
          fontSize={20}
        >
          Stack
        </text>

        {visitedNodes.map((node, i) =>
          renderNode(
            node,
            (i + 1) * (rectDimensions.width + rectDimensions.margin) + padding,
          ),
        )}

        {visitedNodes.length > 0 && (
          <>
            <svg
              className="fill-primary"
              height="40px"
              width="200px"
              version="1.1"
              x={
                visitedNodes.length *
                  (rectDimensions.width + rectDimensions.margin) +
                padding -
                padding / 3
              }
              y={midpointY + rectDimensions.height / 4}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 330 330"
            >
              <path d="M315,150H105V90c0-6.067-3.655-11.537-9.26-13.858c-5.606-2.322-12.058-1.038-16.347,3.252l-75,75 c-5.858,5.858-5.858,15.355,0,21.213l75,75c2.87,2.87,6.705,4.394,10.61,4.394c1.932,0,3.881-0.374,5.737-1.142 c5.605-2.322,9.26-7.791,9.26-13.858v-60h210c8.284,0,15-6.716,15-15C330,156.716,323.284,150,315,150z M75,203.787L36.213,165 L75,126.213V203.787z" />
            </svg>
            <text
              x={
                visitedNodes.length *
                  (rectDimensions.width + rectDimensions.margin) +
                padding +
                rectDimensions.width * 2
              }
              y={midpointY + rectDimensions.height / 2}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="fill-primary"
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
