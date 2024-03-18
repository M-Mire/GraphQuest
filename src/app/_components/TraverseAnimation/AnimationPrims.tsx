import React, { useEffect, useRef, useState } from "react";
import { getNodeColour } from "~/app/utils/getNodeColour";
import type Node from "~/app/model/Node";
import { Command } from "~/app/_GraphAlgorithm/Graph";
import type { Line, TrackerArray } from "~/app/_GraphAlgorithm/Graph";
import {
  InstructionType,
  Order,
  SingleInstruction,
  TrackerElementType,
} from "~/app/_GraphAlgorithm/Graph";
import { useThemeContext } from "~/app/context/ThemeContext";

interface TraverseAnimationProps {
  tracker: TrackerArray;
  currentIndex: number;
  nodes: Node[];
  isPlay: boolean;
}

const TraverseAnimationPrims: React.FC<TraverseAnimationProps> = ({
  nodes,
  currentIndex,
  tracker,
  isPlay,
}) => {
  const rectHeight = 80;
  const rectWidth = 70;
  const rectMargin = 20;
  const padding = 20;

  const totalWidth =
    (rectWidth + rectMargin + padding) * (nodes.length + 1) + 6 * padding;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [previousCost, setPrevCost] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(400);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (currentIndex === -1) {
      resetAnimation();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (
      currentIndex >= 0 &&
      currentIndex < tracker.length &&
      tracker[currentIndex] &&
      isPlay
    ) {
      const [command, val] = tracker[currentIndex] as [
        Command | Line | Order,
        TrackerElementType | SingleInstruction[],
      ];
      if (isOrder(command)) {
        const tmp = val as SingleInstruction[];
        for (const [cmd, value] of tmp) {
          handleCommand(cmd, value);
        }
      } else if (isCommand(command)) {
        const tmp = val as TrackerElementType;
        handleCommand(command, tmp);
      }
    }
  }, [currentIndex, tracker, isPlay]);

  const handleCommand = (command: InstructionType, val: TrackerElementType) => {
    console.log(command);
    const getNode = nodes.find((node) => node.val === val)!;
    if (command === Command.Visited) {
      const updatedNode = { ...getNode, visited: true };
      setVisitedNodes([...visitedNodes, updatedNode]);
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
    }
  };
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

  const resetAnimation = () => {
    setVisitedNodes([]);
    setPrevCost(null);
    setCurrentWeight(0);
  };
  const lineX = padding + rectWidth + (rectWidth + rectMargin) / 2;
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
        <g key={`group-total-weight`}>
          <text
            x={rectWidth}
            y={26}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={theme.text.title}
            fontSize={20}
          >
            Total Weight
          </text>
          <rect
            x={(lineX - rectWidth) / 2}
            y={rectHeight / 2 + 5}
            width={rectWidth}
            height={rectHeight}
            fill={theme.node.completed}
            stroke="white"
            strokeWidth={3}
          />
          <text
            x={lineX / 2}
            y={rectHeight + 5}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={theme.node.text}
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
          stroke={theme.background.quaternary}
        />

        <text
          x={lineX + rectWidth / 2 + rectMargin}
          y={26}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={theme.text.title}
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
                    fill={theme.node.visited}
                    stroke="white"
                    strokeWidth={3}
                  />
                  <text
                    x={x + rectWidth / 2}
                    y={y + 5 + rectHeight / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={theme.node.defaultStroke}
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

function isCommand(type: InstructionType): type is Command {
  return (type as Command) in Command;
}

function isOrder(type: InstructionType): type is Order {
  return type === Order.Entry;
}
