import NodeElement from "../GraphUI/NodeElement";
import type Node from "~/app/model/Node";
import Edge from "~/app/_components/GraphUI/Edge";
import InformationBoardGraphNode from "../SharedUI/InformationBoardItems/InformationBoardGraphNode";
import InformationBoard from "../SharedUI/InformationBoard";
import { useThemeContext } from "~/app/context/ThemeContext";
interface CanvasProps {
  isPlay: boolean;
  rootValue: number | null;
  setRootValue: React.Dispatch<React.SetStateAction<number | null>>;
  nodes: Node[];
  isWeighted: boolean;
  minCanvas: { minHeight: number; minWidth: number };
  isUndirectedGraph: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  isPlay,
  rootValue,
  setRootValue,
  nodes,
  isWeighted,
  minCanvas,
  isUndirectedGraph,
}) => {
  const { theme } = useThemeContext();
  const style = {
    minWidth: `${minCanvas.minWidth ? `${minCanvas.minWidth + 16}` : "100%"}`,
    width: "100%",
    minHeight: `${
      minCanvas.minHeight ? `calc( ${minCanvas.minHeight}px )` : "calc( 100% )"
    }`,
    height: "calc(100% - 50px)",
  };
  const handleClick = (e: React.MouseEvent) => {
    if (isPlay) {
      return;
    } // if Animation is playing user can't set new RootValue
    const { target } = e;
    const nodeName = (target as HTMLElement).tagName;

    if (nodeName !== "svg" && nodeName !== "circle" && nodeName !== "text") {
      return;
    }
    const textContent = (target as HTMLElement).getAttribute("name");
    if (textContent) {
      const clickedNode = nodes.find(
        (node) => node.val === parseInt(textContent),
      )!.val;
      setRootValue(clickedNode);
    }
  };
  return (
    <>
      <div
        id="editMode"
        className="h-2/3 overflow-auto rounded-2xl border-2 sm:mb-2 md:relative md:left-0 md:top-0 md:w-[65%] lg:w-[70%]"
        style={{
          background: theme.background.secondary,
          borderColor: theme.background.quaternary,
        }}
      >
        <InformationBoard minCanvas={minCanvas}>
          <InformationBoardGraphNode
            name={"Root Node"}
            colour={theme.node.root}
            stroke={theme.node.rootStroke}
          />
          <InformationBoardGraphNode
            name={"Visited Node"}
            colour={theme.node.visited}
          />
          <InformationBoardGraphNode
            name={"Completed Node"}
            colour={theme.node.completed}
          />
          <InformationBoardGraphNode
            name={"Unvisited Node"}
            colour={theme.node.unvisited}
          />
        </InformationBoard>
        <div style={style}>
          <svg
            style={{
              minWidth: `${
                minCanvas.minWidth ? `${minCanvas.minWidth + 16}` : "100%"
              }`,
              width: "100%",
              minHeight: `${
                minCanvas.minHeight
                  ? `calc(2/3 * ${minCanvas.minHeight}px)`
                  : " 100% "
              }`,
              height: "100%",
            }}
            onClick={(e) => handleClick(e)}
          >
            {nodes?.map((node) => {
              if (node.val === rootValue) {
                return (
                  <NodeElement
                    key={node.id}
                    node={node}
                    rootValue={rootValue}
                  />
                );
              }
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
                      isWeighted={isWeighted}
                      node={parentNode}
                      childNode={childNode}
                      isUndirectedGraph={isUndirectedGraph}
                    />
                  );
                }
                return null;
              }),
            )}
          </svg>
        </div>
      </div>
    </>
  );
};

export default Canvas;
