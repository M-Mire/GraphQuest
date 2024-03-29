import React, { useEffect, useRef, useState } from "react";
import { getNodeColour } from "~/app/utils/getNodeColour";
import type Node from "~/app/model/Node";
import { useSearchParams } from "next/navigation";
import convertToLetter from "~/app/utils/convertToLetter";
import { useThemeContext } from "~/app/context/ThemeContext";
interface TraverseAnimationProps {
  nodes: Node[];
}

const TraverseAnimationBFS: React.FC<TraverseAnimationProps> = ({ nodes }) => {
  const rectHeight = 80;
  const rectWidth = 70;
  const rectMargin = 20;
  const arrowSize = 20;
  const padding = 20;

  const totalWidth =
    nodes.length * rectWidth + (nodes.length - 1) * rectMargin + 2 * padding;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);
  const [arrowPoint, setArrowPoint] = useState<[number, string] | null>(null);
  const [visitStack, setVisitStack] = useState<Node[]>([]);
  const [containerHeight, setContainerHeight] = useState<number>(400);
  const { theme } = useThemeContext();
  const searchParams = useSearchParams();
  const isLetter = searchParams?.get("lettered") === "true";

  useEffect(() => {
    if (containerRef.current && arrowPoint !== null) {
      containerRef.current.scrollLeft =
        (arrowPoint[0] - 1) * (rectWidth + rectMargin) - padding;
    }
  }, [arrowPoint, rectWidth, rectMargin, padding]);

  //most annoying part oh my days
  useEffect(() => {
    const updatedVisitedNodes = nodes.reduce(
      (accumulator, node) => {
        const existingVisitedNode = accumulator.find(
          (visitedNode) => visitedNode.id === node.id,
        );
        if (node.visited) {
          if (existingVisitedNode) {
            const updatedNode = {
              ...existingVisitedNode,
              visitedChildrens:
                node.visitedChildrens || existingVisitedNode.visitedChildrens,
            };
            const updatedIndex = accumulator.indexOf(existingVisitedNode);
            accumulator.splice(updatedIndex, 1, updatedNode);
            if (node.visitedChildrens || existingVisitedNode.visitedChildrens) {
              if (visitStack.length === 0) {
                setVisitStack([updatedNode]);
              } else {
                if (!visitStack.some((vs) => vs.id === updatedNode.id)) {
                  setVisitStack([...visitStack, updatedNode]);
                }
              }
            }
          } else {
            accumulator.push(node);
          }
        }
        return accumulator;
      },
      [...visitedNodes],
    );

    const isNodeEmpty = nodes.filter((node) => node.visited).length > 0;
    if (isNodeEmpty) {
      setVisitedNodes(updatedVisitedNodes);
    } else {
      setVisitedNodes([]);
    }

    //Arrow
    if (visitedNodes.length === 0) {
      const firstVisitedNode = nodes.find((node) => node.visited);
      if (firstVisitedNode) {
        setArrowPoint([0, firstVisitedNode.id]);
      }
    } else {
      const nextVisitedNode = updatedVisitedNodes.find(
        (visitedNode) => !visitedNode.visitedChildrens,
      );
      if (
        nextVisitedNode &&
        arrowPoint !== null &&
        nextVisitedNode.id !== arrowPoint[1]
      ) {
        const getPrevArrowPoint = arrowPoint[0];
        const getCurrId = nextVisitedNode.id;
        setArrowPoint([getPrevArrowPoint + 1, getCurrId]);
      }
    }
  }, [nodes]);

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
        {visitedNodes.map((node, i) => {
          const x = i * (rectWidth + rectMargin) + padding;
          const y = midpointY;
          return (
            <g key={`g-${node.id}`}>
              <rect
                key={`rect-${node.id}`}
                x={x}
                y={y}
                width={rectWidth}
                height={rectHeight}
                fill={theme.node.visited}
                stroke="white"
                strokeWidth={3}
              />
              <text
                key={`text-${node.id}`}
                x={x + rectWidth / 2}
                y={y + rectHeight / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill={theme.node.text}
              >
                {isLetter ? convertToLetter(node.val) : node.val}
              </text>
              {arrowPoint !== null && i === arrowPoint[0] ? (
                <polygon
                  key={`arrow-${node.id}`}
                  points={`${x + rectWidth / 2},${y - arrowSize} ${
                    x + rectWidth / 2 - arrowSize / 2
                  },${y} ${x + rectWidth / 2 + arrowSize / 2},${y}`}
                  fill={theme.node.defaultStroke}
                />
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default TraverseAnimationBFS;
