import {
  ActionNode,
  ACTIONS_NODE,
} from "~/app/_components/GraphUI/NodeElement";
import Node from "~/app/model/Node";
import React, { useState, useEffect, useCallback } from "react";
import isStringNumber from "~/app/utils/isStringNumber";
import { useSearchParams, useRouter } from "next/navigation";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  provideEdgeLength?: boolean;
  node: Node;
  childNode: Node;
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
  const getNodeDistance = () => {
    if (node && childNode?.val !== undefined) {
      const indexOfChild = node.childNodes.indexOf(childNode.val);
      if (indexOfChild !== -1 && node?.distances[indexOfChild] !== undefined) {
        return "" + node.distances[indexOfChild];
      }
    }
    return "";
  };

  const [editable, setEditable] = useState(false);
  const [inputValue, setInputValue] = useState<string>(getNodeDistance());
  const searchParams = useSearchParams()!;
  const isEditMode = searchParams.get("edit");
  const router = useRouter();
  const updateNodeWeightQueryString = useCallback(
    (
      name: string,
      valueToRemove: string,
      childNode: number,
      weight: number,
    ) => {
      const params = new URLSearchParams(searchParams);
      const values = params.getAll(name);

      if (values.length) {
        params.delete(name);
        for (const value of values) {
          if (value !== valueToRemove) {
            params.append(name, value);
          }
        }
      }
      const updateNode = JSON.parse(JSON.stringify(node)) as Node;
      const indexOfChild = updateNode.childNodes.indexOf(childNode);
      updateNode.distances[indexOfChild] = weight;
      const encodeNode = encodeURIComponent(JSON.stringify(updateNode));
      params.append(name, encodeNode);
      return params.toString();
    },
    [searchParams],
  );

  const dispatchAndClear = () => {
    if (dispatch === undefined) return;
    const weight = parseInt(inputValue);
    dispatch({
      type: ACTIONS_NODE.NODE_DISTANCE,
      payload: {
        node: node,
        childNode: childNode.val,
        parsedDistance: weight,
      },
    });
    setEditable(false);
    const parentNodeEncoded = encodeURIComponent(JSON.stringify(node));

    router.push(
      `?${updateNodeWeightQueryString(
        "node",
        parentNodeEncoded,
        childNode.val,
        weight,
      )}`,
    );
  };

  const handleTextClick = () => {
    if (provideEdgeLength) {
      setEditable(true);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") return;
    if (e.key === "Enter" && inputValue !== "") {
      dispatchAndClear();
      e.currentTarget.blur();
    } else if (!isStringNumber(e.key)) e.preventDefault();
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
        style={{
          stroke:
            node?.currentlyVisitedPair && childNode?.currentlyVisitedPair
              ? "yellow"
              : "black",
          strokeWidth: 2,
        }}
      />
      {provideEdgeLength ? (
        <foreignObject
          x={midX}
          y={midY}
          width="40"
          height="30"
          style={{
            rotate: `${rotationAngle}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          {editable && isEditMode ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleTextChange}
              // onBlur={handleTextBlur}
              onKeyDown={handleInputKeyDown}
            />
          ) : (
            <span onClick={handleTextClick}>{inputValue}</span>
          )}
        </foreignObject>
      ) : null}
    </>
  );
};

export default Edge;
