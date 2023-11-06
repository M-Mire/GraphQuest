import { Node, ActionNode, ACTIONS_NODE } from "~/app/_components/NodeElement";
import React, { useState, useEffect } from "react";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  provideEdgeLength?: boolean;
  node?: Node;
  childNode?: number;
  dispatch?: React.Dispatch<ActionNode>;
}

const Edge: React.FC<EdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  provideEdgeLength,
  node,
  childNode,
  dispatch,
}) => {
  const [editable, setEditable] = useState(false);
  const [distance, setDistance] = useState<string | undefined>(
    node?.distances.get(childNode!)?.toString(),
  );

  // Initialise!
  useEffect(() => {
    if (provideEdgeLength && node) {
      let distanceValue = node.distances.get(childNode!);
      if (distanceValue === undefined) {
        distanceValue = 0;
        if (dispatch) {
          dispatch({
            type: ACTIONS_NODE.NODE_DISTANCE,
            payload: {
              node: node,
              childNode: childNode!,
              parsedDistance: 0,
            },
          });
        }
      }
      setDistance(distanceValue.toString());
    }
  }, [provideEdgeLength, node, childNode, dispatch]);

  const handleTextClick = () => {
    if (provideEdgeLength) {
      setEditable(true);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(event.target.value);
  };

  const handleTextBlur = () => {
    setEditable(false);

    if (provideEdgeLength && node) {
      const parsedDistance = parseInt(distance ?? "0");
      if (!isNaN(parsedDistance) && dispatch) {
        dispatch({
          type: ACTIONS_NODE.NODE_DISTANCE,
          payload: {
            node: node,
            childNode: childNode!,
            parsedDistance: parsedDistance,
          },
        });
        setDistance(parsedDistance.toString());
      }
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTextBlur();
    }
  };

  const circleRadius = 18;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const distanceAB = Math.sqrt(dx * dx + dy * dy);
  const scale = circleRadius / distanceAB;
  const edgeStartX = x1 + dx * scale;
  const edgeStartY = y1 + dy * scale;
  const edgeEndX = x2 - dx * scale;
  const edgeEndY = y2 - dy * scale;

  const midX = (edgeStartX + edgeEndX) / 2;
  const midY = (edgeStartY + edgeEndY) / 2;

  const rotationAngle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <>
      <defs>
        <marker
          id="markerArrow"
          markerWidth="13"
          markerHeight="13"
          refX="9.5"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "#HHH" }} />
        </marker>
      </defs>
      <line
        x1={edgeStartX}
        y1={edgeStartY}
        x2={edgeEndX}
        y2={edgeEndY}
        markerEnd={"url(#markerArrow)"}
        style={{ stroke: "black", strokeWidth: 2 }}
      />
      {provideEdgeLength && distance !== undefined ? (
        <foreignObject
          x={midX}
          y={midY}
          width="40"
          height="30"
          style={{
            rotate: `${rotationAngle}deg)`, // this is going to break the rotation. Remove ")" to get it to work; however, it's super far from the line, so additional adjustments are needed
            transformOrigin: "50% 50%",
          }}
        >
          {editable ? (
            <input
              type="text"
              value={distance}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleInputKeyPress}
            />
          ) : (
            <span onClick={handleTextClick}>{distance}</span>
          )}
        </foreignObject>
      ) : null}
    </>
  );
};

export default Edge;
