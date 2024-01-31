import { useState, useReducer } from "react";
import { Line } from "~/app/_GraphAlgorithm/Graph";
import type { ActionLine } from "~/app/_components/CanvasElements/Animation"; // Import ActionLine from the correct file

const lineReducer: React.Reducer<number[], ActionLine> = (
  lineNumbers,
  action,
) => {
  switch (action.type) {
    case Line.EntryLine:
      return [...lineNumbers, action.payload as number];
    case Line.FinishedLine:
      return lineNumbers.filter(
        (number) => number !== (action.payload as number),
      );
    case Line.LineReset:
      return [];
    default:
      return lineNumbers;
  }
};

const useAnimationManagement = () => {
  const [speed, setSpeed] = useState<number>(500);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [rootValue, setRootValue] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lineNumbers, dispatchLineNumbers] = useReducer(lineReducer, []);

  return {
    speed,
    setSpeed,
    isPlay,
    setPlay,
    rootValue,
    setRootValue,
    currentIndex,
    setCurrentIndex,
    lineNumbers,
    dispatchLineNumbers,
  };
};

export default useAnimationManagement;
