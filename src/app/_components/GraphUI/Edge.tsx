import { ACTIONS_NODE } from "~/app/_components/GraphUI/NodeElement";
import type { ActionNode } from "~/app/_components/GraphUI/NodeElement";
import type Node from "~/app/model/Node";
import { useState } from "react";
import isStringNumber from "~/app/utils/isStringNumber";
import { useSearchParams, useRouter } from "next/navigation";
import useUpdateNodeQueryString from "~/app/hooks/useUpdateNodeQueryString";
import updateNodeWeightEncoded from "~/app/utils/EncodeNode/updateNodeWeightEncoded";
import { useThemeContext } from "~/app/context/ThemeContext";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isWeighted: boolean;
  node: Node;
  childNode: Node;
  dispatch?: React.Dispatch<ActionNode>;
  isUndirectedGraph: boolean;
}

const Edge: React.FC<EdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  isWeighted,
  node,
  childNode,
  dispatch,
  isUndirectedGraph,
}) => {
  const { theme } = useThemeContext();
  const arrowStyle = theme.edge.color;

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
  const updateNodeQueryString = useUpdateNodeQueryString(router);

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
    updateNodeQueryString(
      searchParams.toString(),
      node,
      updateNodeWeightEncoded(node, childNode.val, weight),
    );
  };

  const handleTextClick = () => {
    if (isWeighted) {
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

  const circleRadius = 21;

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
      {!isUndirectedGraph && (
        <defs>
          <marker
            id="markerArrow"
            markerWidth="13"
            markerHeight="13"
            refX="9.5"
            refY="6"
            orient="auto"
          >
            <path
              d="M2,2 L2,11 L10,6 L2,2"
              style={{
                fill: arrowStyle,
              }}
            />
          </marker>
        </defs>
      )}

      <line
        x1={edgeStartX}
        y1={edgeStartY}
        x2={edgeEndX}
        y2={edgeEndY}
        markerEnd={"url(#markerArrow)"}
        style={{
          stroke: arrowStyle,
          strokeWidth: 2,
        }}
      />
      {isWeighted ? (
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
            <span onClick={handleTextClick} style={{ color: theme.edge.color }}>
              {inputValue}
            </span>
          )}
        </foreignObject>
      ) : null}
    </>
  );
};

export default Edge;
