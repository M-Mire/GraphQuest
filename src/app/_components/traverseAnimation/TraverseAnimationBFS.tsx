import React, { useEffect, useRef, useState } from "react";
import { Node, COLOUR_SELECTION } from "~/app/_components/NodeElement";
interface TraverseAnimationProps {
  nodes: Node[];
}

const TraverseAnimation: React.FC<TraverseAnimationProps> = ({ nodes }) => {
  const rectHeight = 80;
  const rectWidth = 70;
  const rectMargin = 20;
  const arrowSize = 20;
  const padding = 20;

  const totalWidth =
    nodes.length * rectWidth + (nodes.length - 1) * rectMargin + 2 * padding;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);
  const [arrowPoint, setArrowPoint] = useState<[number, number] | null>(null);
  const [visitStack, setVisitStack] = useState<Node[]>([]);

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

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 h-1/4 w-3/4 bg-atomOneDark"
      style={{ overflowX: "auto" }}
    >
      <svg width={totalWidth} className="relative h-full">
        {visitedNodes.map((node, i) => {
          const x = i * (rectWidth + rectMargin) + padding;
          const y = rectHeight / 2;
          return (
            <g key={`g-${node.id}`}>
              <rect
                key={`rect-${node.id}`}
                x={x}
                y={y}
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
                key={`text-${node.id}`}
                x={x + rectWidth / 2}
                y={y + rectHeight / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
              >
                {node.val}
              </text>
              {arrowPoint !== null && i === arrowPoint[0] ? (
                <polygon
                  key={`arrow-${node.id}`}
                  points={`${x + rectWidth / 2},${y - arrowSize} ${
                    x + rectWidth / 2 - arrowSize / 2
                  },${y} ${x + rectWidth / 2 + arrowSize / 2},${y}`}
                  fill="red"
                />
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default TraverseAnimation;
