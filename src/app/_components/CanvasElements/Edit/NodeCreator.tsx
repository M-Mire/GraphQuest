import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckIcon from "@mui/icons-material/Check";
import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";
import { ACTIONS_NODE, ActionNode } from "../../GraphUI/NodeElement";
import Node from "~/app/model/Node";
import NodeItem from "./NodeItem";
import createNewNode from "~/app/utils/createNewNode";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DEFAULT_RADIUS_BIG_CIRCLE } from "~/app/constants/Node";
import { Alerts } from "../../SharedUI/Alert";
import useQueryString from "~/app/hooks/useQueryString";
import Link from "next/link";

interface NodeCreatorProps {
  minCanvas: { minHeight: number; minWidth: number };
  dispatch: React.Dispatch<ActionNode>;
  nodes: Node[];
  activeNode: number;
  setActiveNode: React.Dispatch<React.SetStateAction<number>>;
  setAlert: React.Dispatch<React.SetStateAction<Alerts | null>>;
}

const NodeCreator = ({
  minCanvas,
  nodes,
  dispatch,
  activeNode,
  setActiveNode,
  setAlert,
}: NodeCreatorProps) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSave, setSave] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const { createQueryString, deleteQueryString } = useQueryString();
  const pathname = usePathname();

  const targetQueryName = "lettered";
  const isLetter = searchParams?.get(targetQueryName) === "true";

  const toggleQueryString = () =>
    searchParams.get(targetQueryName)
      ? pathname + "?" + deleteQueryString(targetQueryName)
      : pathname + "?" + createQueryString(targetQueryName, "true");

  const handleSaveClick = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("node");
    nodes.forEach((node) =>
      newParams.append("node", encodeURIComponent(JSON.stringify(node))),
    );

    const paramString = newParams.toString();
    router.push(`?${paramString}`);

    navigator.clipboard
      .writeText(
        `${window.location.origin}/${window.location.pathname}?${paramString}`,
      )
      .then(() => {
        setSave(true);
        setTimeout(() => setSave(false), 3000);
      })
      .catch((error) => console.error("Failed to copy text:", error));
  };

  const randomPosition = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

  const handleAddButtonClick = () => {
    if (nodes.length >= 20) {
      setAlert(nodes.length === 10 ? Alerts.Amber : Alerts.Warning);
      return;
    }

    const maxNodeValue = nodes.length
      ? Math.max(...nodes.map((node) => node.val))
      : 0;
    const x = randomPosition(DEFAULT_RADIUS_BIG_CIRCLE, minCanvas.minWidth);
    const y = randomPosition(DEFAULT_RADIUS_BIG_CIRCLE, minCanvas.minHeight);
    const newNode = createNewNode(x, y, maxNodeValue + 1);

    dispatch({ type: ACTIONS_NODE.ADD_NODE, payload: newNode });
  };

  const renderIconButton = (
    icon: JSX.Element,
    label: string,
    onClick?: () => void,
  ) => (
    <div
      className="flex cursor-pointer items-center space-x-1"
      onClick={onClick}
    >
      <IconButton color="primary" size="small">
        {icon}
      </IconButton>
      <span className="text-sm">{label}</span>
    </div>
  );

  return (
    <div className="mx-auto w-2/3 md:absolute md:right-0 md:top-4 md:mr-3 md:h-[calc(100%_-_1.5rem)] md:w-[33%] lg:mr-4 lg:w-[28%]">
      <div className="mt-4 h-full overflow-y-auto rounded-md border-2 md:mt-0">
        <div className="mb-2 flex items-center justify-between border-b-2 px-4 text-xs">
          <div className="inline-flex items-center py-2">
            {nodes.length > 0 ? (
              renderIconButton(
                <AddIcon fontSize="inherit" className="fill-primary" />,
                "Add Node",
                handleAddButtonClick,
              )
            ) : (
              <div className="flex h-8 items-center justify-center">
                Click on Canvas to add Node
              </div>
            )}
          </div>
          <div className="flex items-center py-1">
            <Link href={toggleQueryString()}>
              {renderIconButton(
                <SwitchAccessShortcutIcon
                  fontSize="inherit"
                  className="fill-primary"
                />,
                isLetter ? "Numbered" : "Lettered",
              )}
            </Link>
            {nodes.length > 0 &&
              (!isSave
                ? renderIconButton(
                    <ContentPasteIcon
                      fontSize="inherit"
                      className="fill-primary"
                    />,
                    "Save Graph",
                    handleSaveClick,
                  )
                : renderIconButton(
                    <CheckIcon fontSize="inherit" className="fill-primary" />,
                    "Saved!",
                  ))}
          </div>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {nodes
            .sort((a, b) => a.val - b.val)
            .map((node) => (
              <NodeItem
                key={node.id}
                node={node}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                dispatch={dispatch}
                nodes={nodes}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default NodeCreator;
