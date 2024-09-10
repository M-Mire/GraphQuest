import { ACTIONS_NODE, ActionNode } from "../../GraphUI/NodeElement";
import Node from "~/app/model/Node";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useSearchParams, useRouter } from "next/navigation";

interface NodeItemProps {
  dispatch: React.Dispatch<ActionNode>;
  node: Node;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  nodes: Node[];
  activeNode: number;
  setActiveNode: React.Dispatch<React.SetStateAction<number>>;
}

export default function NodeItem({
  dispatch,
  node,
  selectedNode,
  setSelectedNode,
  nodes,
  activeNode,
  setActiveNode,
}: NodeItemProps) {
  const searchParams = useSearchParams();
  const isLetter = searchParams?.get("lettered") === "true";

  const isSelected = selectedNode?.id === node.id;

  const handleArrowUp = () => {
    setSelectedNode(null);
  };

  const handleArrowDown = () => {
    setSelectedNode(node);
  };

  const handleDeselectNode = (parent: Node, child: Node) => {
    dispatch({
      type: ACTIONS_NODE.REMOVE_CHILD_NODE,
      payload: {
        parent: parent.val,
        childRemove: child.val,
      },
    });
  };

  const handleSelectNode = (parent: Node, child: Node) => {
    dispatch({
      type: ACTIONS_NODE.ADD_CHILD_NODE,
      payload: {
        parentNode: parent.val,
        childNode: child.val,
        weight: 0,
      },
    });
  };

  const handleDelete = () => {
    if (node.val === activeNode) {
      setActiveNode(-1);
    }
    dispatch({
      type: ACTIONS_NODE.DELETE_NODE,
      payload: { deleteId: node.id },
    });
  };

  const convertToLetter = (val: number) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    while (val > 0) {
      const remainder = (val - 1) % 26;
      result = alphabet[remainder] + result;
      val = Math.floor((val - 1) / 26);
    }
    return result;
  };

  return (
    <div className="m-2">
      <div
        className={` ${
          isSelected ? "flex min-h-[3rem]" : ""
        } rounded-lg border-2`}
      >
        <div className={`m-2 flex items-center`}>
          {isLetter ? <p>{convertToLetter(node.val)}</p> : <p>{node.val}</p>}
          {isSelected ? (
            <IconButton onClick={handleArrowUp}>
              <ArrowDropUpIcon className="fill-primary ml-[0.2rem] text-[1.7rem]" />
            </IconButton>
          ) : (
            <IconButton onClick={handleArrowDown}>
              <ArrowDropDownIcon className="fill-primary ml-[0.2rem] text-[1.7rem]" />
            </IconButton>
          )}

          {!isSelected && (
            <IconButton
              onClick={() => handleDelete()}
              className={`ml-auto h-4 w-4`}
            >
              <DeleteForeverIcon className="fill-[#FF0000]" />
            </IconButton>
          )}
        </div>
        {isSelected && (
          <div className="my-2 ml-2 flex flex-wrap">
            {nodes
              .sort((a, b) => a.val - b.val)
              .map((nodeItem, index) => {
                const classStyles =
                  "my-1 mr-2 flex h-12 w-12 items-center justify-center px-2 border-2 rounded-2xl cursor-pointer";
                // Skips nodeitem of the selected node
                if (selectedNode.id === nodeItem.id) {
                  return null;
                  // Highlights the nodeItems.childNodes of the selectedNode
                  // If user clicks on the selectedNode.childNodes it will deselect and pop from the childNodes
                } else if (
                  nodes
                    .find((n) => selectedNode.id === n.id)
                    ?.childNodes.includes(nodeItem.val)
                ) {
                  return (
                    <div
                      key={index}
                      className={`${classStyles}`}
                      onClick={() => handleDeselectNode(selectedNode, nodeItem)}
                    >
                      {isLetter ? (
                        <p>{convertToLetter(nodeItem.val)}</p>
                      ) : (
                        <p>{nodeItem.val}</p>
                      )}
                    </div>
                  );
                } else {
                  // If user clicks on the nodeItem it will add it to the selectedNode.childNodes
                  return (
                    <div
                      key={index}
                      className={`${classStyles}`}
                      onClick={() => handleSelectNode(selectedNode, nodeItem)}
                    >
                      {isLetter ? (
                        <p>{convertToLetter(nodeItem.val)}</p>
                      ) : (
                        <p>{nodeItem.val}</p>
                      )}
                    </div>
                  );
                }
              })}
          </div>
        )}
      </div>
    </div>
  );
}
