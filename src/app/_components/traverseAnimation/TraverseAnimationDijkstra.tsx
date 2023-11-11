import React, { useEffect, useRef, useState } from "react";
import { Node, COLOUR_SELECTION } from "~/app/_components/NodeElement";
import Graph, { Command, Line } from "~/app/_GraphAlgorithm/Graph";
interface TraverseAnimationProps {
  tracker: Array<[Command | Line, number | number[] | Map<number, number>]>;
  currentIndex: number;
  nodes: Node[];
}

const TraverseAnimationDijkstra: React.FC<TraverseAnimationProps> = ({
  tracker,
  currentIndex,
  nodes,
}) => {
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
  const [mapDetail, setMapDetail] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    if (containerRef.current && arrowPoint !== null) {
      containerRef.current.scrollLeft =
        (arrowPoint[0] - 1) * (rectWidth + rectMargin) - padding;
    }
  }, [arrowPoint, rectWidth, rectMargin, padding]);

  useEffect(() => {
    if (currentIndex < tracker.length) {
      const [command, val] = tracker[currentIndex]! as [
        Command | Line,
        number | number[] | Map<number, number>,
      ];
      if ((command as Command) && command === Command.UpdateMap) {
        console.log(mapDetail);
        setMapDetail(val as Map<number, number>);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const updatedVisitedNodes = nodes.sort((a, b) => a.val - b.val);

    if (updatedVisitedNodes.length > 0) {
      setVisitedNodes(updatedVisitedNodes);
      //All the updatedVisitedNodes.val as key and infinity as pair
      if (mapDetail.size < 0) {
        const newMapDetail = updatedVisitedNodes.reduce((map, node) => {
          map.set(node.val, Infinity);
          return map;
        }, new Map<number, number>());
        setMapDetail(newMapDetail);
      }
    } else {
      setVisitedNodes([]);
    }

    //Arrow
    const currentVisitedNode = updatedVisitedNodes.find(
      (visitedNode) => !visitedNode.visitedChildrens,
    );

    if (currentVisitedNode) {
      const currentIndex = updatedVisitedNodes.indexOf(currentVisitedNode);

      setArrowPoint([currentIndex, currentVisitedNode.id]);
    } else {
      setArrowPoint(null);
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
            <>
              <g key={`g-${node.val}`}>
                <rect
                  key={`rect-${node.val}`}
                  x={x}
                  y={y}
                  width={rectWidth}
                  height={rectHeight}
                  fill="none"
                  stroke="white"
                  strokeWidth={3}
                />
                <text
                  key={`text-${node.val}`}
                  x={x + rectWidth / 2}
                  y={y + rectHeight / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                >
                  {mapDetail.get(node.val)}
                </text>
              </g>
              {arrowPoint !== null ? (
                <text
                  key={`arrow-text-${i}`}
                  x={x + rectWidth / 2}
                  y={y - arrowSize / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="red"
                >
                  {node.val}
                </text>
              ) : null}
            </>
          );
        })}
      </svg>
    </div>
  );
};

export default TraverseAnimationDijkstra;
