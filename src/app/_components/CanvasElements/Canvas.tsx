import { useState } from "react";
import NodeElement from "../GraphUI/NodeElement";
import Node from "~/app/model/Node";
import Edge from "~/app/_components/GraphUI/Edge";

interface CanvasProps {
  nodes: Node[];
  provideEdgeLength?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ nodes, provideEdgeLength }) => {
  return (
    <>
      <div
        id="editMode"
        className="h-2/3 overflow-auto rounded-2xl bg-slate-600 sm:mb-2 md:relative md:left-0 md:top-0 md:w-[65%] lg:w-[70%]"
      >
        <svg className="h-full w-full">
          {nodes?.map((node) => {
            return <NodeElement key={node.id} node={node} />;
          })}
          {nodes.map((parentNode) =>
            parentNode.childNodes.map((childVal, id) => {
              const childNode = nodes.find((node) => node.val === childVal);
              if (childNode) {
                return (
                  <Edge
                    key={id}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={childNode.x}
                    y2={childNode.y}
                    provideEdgeLength={provideEdgeLength}
                    node={parentNode}
                    childNode={childNode}
                  />
                );
              }
              return null;
            }),
          )}
          <InformationBoard />
        </svg>
      </div>
    </>
  );
};

export default Canvas;

const InformationBoard = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleBoard = () => {
    setIsOpen(!isOpen);
  };

  const RECT_HEIGHT = 150;
  const RECT_WIDTH = 150;
  const TEXT_H_FONT_SIZE = 14;
  const TEXT_H_X_PADDING = 10;
  const TEXT_P_FONT_SIZE = 12;
  const X_NODE = 20;
  const CIRCLE_RADIUS = 10;
  const FIRST_NODE_Y = 45;
  const NODE_PADDING = 35;
  const TEXT_Y_PADDING = 4;
  const TEXT_X_PADDING = 20;
  const ROUNDED_VAL = 20;

  return (
    <>
      {isOpen && (
        <>
          <rect
            x={0}
            y={0}
            width={RECT_WIDTH}
            height={RECT_HEIGHT}
            rx={ROUNDED_VAL}
            ry={ROUNDED_VAL}
            fill="black"
            opacity={0.3}
          />
          <text
            x={TEXT_H_X_PADDING}
            y={TEXT_H_FONT_SIZE + 2}
            fill="white"
            fontSize={TEXT_H_FONT_SIZE}
            fontWeight="bold"
          >
            Information Board
          </text>
          <circle
            name={`CIRCLE`}
            cx={X_NODE}
            cy={FIRST_NODE_Y}
            r={CIRCLE_RADIUS}
            stroke="black"
            strokeWidth="3"
            fill="purple"
          />
          <text
            x={X_NODE + TEXT_X_PADDING}
            y={FIRST_NODE_Y + TEXT_Y_PADDING}
            fill="white"
            fontSize={TEXT_P_FONT_SIZE}
            fontWeight="bold"
          >
            Processed
          </text>
          <circle
            name={`CIRCLE`}
            cx={X_NODE}
            cy={FIRST_NODE_Y + NODE_PADDING}
            r={CIRCLE_RADIUS}
            stroke="black"
            strokeWidth="3"
            fill="grey"
          />
          <text
            x={X_NODE + TEXT_X_PADDING}
            y={FIRST_NODE_Y + NODE_PADDING + TEXT_Y_PADDING}
            fill="white"
            fontSize={TEXT_P_FONT_SIZE}
            fontWeight="bold"
          >
            Children Visited
          </text>
        </>
      )}
      <ToggleInformationBoard
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        x={RECT_WIDTH}
        y={RECT_HEIGHT}
      />
    </>
  );
};

interface ToggleInformationBoardProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  x: number;
  y: number;
}
const ToggleInformationBoard: React.FC<ToggleInformationBoardProps> = ({
  isOpen,
  setIsOpen,
  x,
  y,
}) => {
  const RECT_HEIGHT = 30;
  const RECT_WIDTH = 20;
  const RECT_Y = y / 2 - RECT_HEIGHT / 2;
  const RECT_X = isOpen ? x : 0;
  const LINE_X = 15;
  const LINE_Y = 15;
  const RECT_PADDING = 6;
  return (
    <g
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <rect
        x={RECT_X}
        y={RECT_Y}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        fill="white"
        stroke="#acb1d6"
        strokeWidth={2}
      />
      <rect
        x={RECT_X + (!isOpen ? RECT_PADDING : 0)}
        y={RECT_Y}
        width={RECT_WIDTH - 5 - 1}
        height={RECT_HEIGHT}
        fill="#acb1d6"
        opacity={0.6}
      />

      <line
        x1={RECT_X + LINE_X - 5}
        y1={RECT_Y + LINE_Y - 5}
        x2={RECT_X + (!isOpen ? RECT_PADDING + LINE_X : 0)}
        y2={RECT_Y + RECT_HEIGHT / 2}
        stroke="#011a87"
        strokeWidth="2"
      />
      <line
        x1={RECT_X + LINE_X + (!isOpen ? RECT_PADDING : 0)}
        y1={RECT_Y + LINE_Y}
        x2={RECT_X + (!isOpen ? RECT_PADDING : 0)}
        y2={RECT_Y + RECT_HEIGHT / 2}
        stroke="#011a87"
        strokeWidth="2"
      />
      <line
        x1={RECT_X + LINE_X - 5}
        y1={RECT_Y + LINE_Y + 5}
        x2={RECT_X + (!isOpen ? RECT_PADDING + LINE_X : 0)}
        y2={RECT_Y + RECT_HEIGHT / 2}
        stroke="#011a87"
        strokeWidth="2"
      />
    </g>
  );
};
