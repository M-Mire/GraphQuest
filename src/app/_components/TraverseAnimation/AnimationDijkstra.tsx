import React, { useEffect, useRef, useState } from "react";
import type Node from "~/app/model/Node";
import { Command } from "~/app/_GraphAlgorithm/Graph";
import type { Line, TrackerArray } from "~/app/_GraphAlgorithm/Graph";

interface TraverseAnimationProps {
  tracker: TrackerArray;
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
  const [arrowPoint, setArrowPoint] = useState<[number, string] | null>(null);
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
        // console.log(mapDetail);
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
      className="h-full w-full"
      style={{ overflowX: "auto" }}
    >
      <svg width={totalWidth} className="relative h-full">
        {visitedNodes.map((node, i) => {
          const x = i * (rectWidth + rectMargin) + padding;
          const y = rectHeight / 2;
          return (
            <g key={`group-${node.val}-${i}`}>
              <rect
                x={x}
                y={y + 5}
                width={rectWidth}
                height={rectHeight}
                fill="none"
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
                {mapDetail.get(node.val)}
              </text>
              <text
                x={x + rectWidth / 2}
                y={y - arrowSize / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={32}
                fill="#FF7676"
                key={`arrow-text-${i}`}
              >
                {node.val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default TraverseAnimationDijkstra;
