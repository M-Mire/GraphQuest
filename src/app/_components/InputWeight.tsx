import { useState, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import isStringNumber from "~/app/utils/isStringNumber";
import { ActionNode, ACTIONS_NODE } from "~/app/_components/NodeElement";
import Node from "../model/Node";

const InputWeightWidth = 250;
const InputWeightHeight = 150;

interface InputWeightProps {
  nums: number[];
  setInputWeight: React.Dispatch<React.SetStateAction<boolean>>;
  setInputWeightNums: React.Dispatch<React.SetStateAction<number[]>>;
  dispatch: React.Dispatch<ActionNode>;
  nodes: Node[];
}

const InputWeight: React.FC<InputWeightProps> = ({
  nums,
  setInputWeight,
  setInputWeightNums,
  dispatch,
  nodes,
}) => {
  const [parent, child] = nums;
  const [hoveredText, setHoveredText] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  // const router = useRouter();
  // const searchParams = useSearchParams()!;

  // const updateNodeQueryString = useCallback(
  //   (
  //     name: string,
  //     valueToRemove: string,
  //     parentNode: number,
  //     childNode: number,
  //     weight: number,
  //   ) => {
  //     const params = new URLSearchParams(searchParams);
  //     const values = params.getAll(name);

  //     if (values.length) {
  //       params.delete(name);
  //       for (const value of values) {
  //         if (value !== valueToRemove) {
  //           params.append(name, value);
  //         }
  //       }
  //     }
  //     const updateNode = nodes.find((node) => node.val === parentNode);

  //     // if found node
  //     console.log("node found");
  //     console.log(updateNode);

  //     //change node
  //     console.log("will change the node");
  //     updateNode?.childNodes.push(childNode);
  //     updateNode?.distances.push(weight);
  //     //encode
  //     console.log("encode node");
  //     const encodeNode = encodeURIComponent(JSON.stringify(updateNode));
  //     console.log(encodeNode);
  //     //decode
  //     // console.log("decode the node");
  //     // const decodeNode = JSON.parse(decodeURIComponent(encodeNode));
  //     // console.log(decodeNode);

  //     params.append(name, encodeNode);
  //     return params.toString();
  //   },
  //   [searchParams],
  // );

  const dispatchAndClear = () => {
    const weight = parseInt(inputValue);
    dispatch({
      type: ACTIONS_NODE.ADD_CHILD_NODE,
      payload: {
        parentNode: parent!,
        childNode: child!,
        weight: weight,
      },
    });
    // const parentNodeEncoded = encodeURIComponent(
    //   JSON.stringify(nodes.find((node) => node.val === parent)),
    // );
    // router.push(
    //   `?${updateNodeQueryString(
    //     "node",
    //     parentNodeEncoded,
    //     parent!,
    //     child!,
    //     weight,
    //   )}`,
    // );
    setInputValue("");
    setInputWeight(false);
    setInputWeightNums([]);
  };

  const handleTextHover = (text: string) => {
    setHoveredText(text);
  };

  const handleTextLeave = () => {
    setHoveredText(null);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue !== "") {
      dispatchAndClear();
      event.currentTarget.blur();
    } else if (!isStringNumber(event.key)) {
      event.preventDefault();
    }
  };

  const handleInputClick = (
    event: React.MouseEvent<SVGTextElement, MouseEvent>,
  ) => {
    const target = event.target as SVGTextElement;
    if (target.tagName === "text" && inputValue !== "") {
      dispatchAndClear();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <g
      transform={`translate(${-InputWeightWidth / 2}, ${
        -InputWeightHeight / 2
      })`}
    >
      <rect
        x="50%"
        y="50%"
        width={InputWeightWidth}
        height={InputWeightHeight}
        fill={`bg-AtomDark`}
        fillOpacity={0.9}
      />
      <g
        transform={`translate(${InputWeightWidth / 2}, ${
          InputWeightHeight / 1.2
        })`}
      >
        <text
          x="50%"
          y="32%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={hoveredText === "num1 - num2" ? "blue" : "white"}
        >
          {parent} -&gt; {child}
        </text>
        <foreignObject
          x="45%"
          y="37.5%"
          width={InputWeightWidth}
          height={InputWeightHeight}
        >
          <input
            type="text"
            style={{ width: "40%", height: "20%" }}
            onKeyDown={handleInputKeyDown}
            onChange={handleInputChange}
            value={inputValue}
          />
        </foreignObject>

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={hoveredText === "Input Weight" ? "blue" : "white"}
          onMouseEnter={() => handleTextHover("Input Weight")}
          onMouseLeave={handleTextLeave}
          onClickCapture={handleInputClick}
          style={{ cursor: "pointer" }}
        >
          Input Weight
        </text>
      </g>
    </g>
  );
};

export default InputWeight;
