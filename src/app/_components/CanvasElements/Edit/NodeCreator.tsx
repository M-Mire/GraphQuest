import { useState } from "react";
import { useThemeContext } from "~/app/context/ThemeContext";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { ACTIONS_NODE, ActionNode } from "../../GraphUI/NodeElement";
import Node from "~/app/model/Node";
import NodeItem from "./NodeItem";
import createNewNode from "~/app/utils/createNewNode";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DEFAULT_RADIUS_BIG_CIRCLE } from "~/app/constants/Node";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckIcon from "@mui/icons-material/Check";
import { Alerts } from "../../SharedUI/Alert";
import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";
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

export default function NodeCreator({
  minCanvas,
  nodes,
  dispatch,
  activeNode,
  setActiveNode,
  setAlert,
}: NodeCreatorProps) {
  const { theme } = useThemeContext();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSave, setSave] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const { createQueryString, deleteQueryString } = useQueryString();
  const pathname = usePathname();

  const targetQueryName = "lettered";
  const isLetter = searchParams?.get(targetQueryName) === "true";

  const toggle = () => {
    if (targetQueryName) {
      return searchParams.get(targetQueryName)
        ? pathname + "?" + deleteQueryString(targetQueryName)
        : pathname + "?" + createQueryString(targetQueryName, "true");
    } else {
      return pathname;
    }
  };

  const handleSaveClick = () => {
    const newParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "node") {
        newParams.append(key, value);
      }
    });
    nodes.forEach((n) => {
      const serializedObj = encodeURIComponent(JSON.stringify(n));
      newParams.append("node", serializedObj);
    });
    const paramString = newParams.toString();
    router.push(`?${paramString}`);

    navigator.clipboard
      .writeText(
        `${window.location.origin}/${window.location.pathname}?${paramString}`,
      )
      .then(
        () => {
          // Set save state to true and then reset after 3 seconds
          setSave(true);
          setTimeout(() => {
            setSave(false);
          }, 3000);
        },
        (error) => {
          console.error("Failed to copy text:", error);
        },
      );
  };

  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

  const handleAddButtonClick = () => {
    if (nodes.length === 10) {
      setAlert(Alerts.Amber);
    } else if (nodes.length === 20) {
      setAlert(Alerts.Warning);
      return;
    }

    const maxNodeValue = nodes.length
      ? Math.max(...nodes.map((node) => node.val))
      : 0;
    const x = random(DEFAULT_RADIUS_BIG_CIRCLE, minCanvas.minWidth);
    const y = random(DEFAULT_RADIUS_BIG_CIRCLE, minCanvas.minHeight);
    const addNode = createNewNode(x, y, maxNodeValue + 1);
    dispatch({
      type: ACTIONS_NODE.ADD_NODE,
      payload: addNode,
    });
  };

  return (
    <div
      className="mx-auto w-2/3 md:absolute md:right-0 md:top-4 md:mr-3 md:h-[calc(100%_-_1.5rem)] md:w-[33%] lg:mr-4 lg:w-[28%]"
      style={{ background: theme.background.primary }}
    >
      <div
        className="mt-4 overflow-y-auto rounded-md  border-2 md:mt-0 "
        style={{
          //   background: theme.background.tertiary,
          minWidth: `${
            minCanvas.minWidth ? `${minCanvas.minWidth + 16}` : "100%"
          }`,
          width: "100%",
          minHeight: `${
            minCanvas.minHeight
              ? `calc(2/3 * ${minCanvas.minHeight}px )`
              : " 100% "
          }`,
          height: "100%",
        }}
      >
        <div
          className="mb-2 flex items-center justify-between border-b-2 px-4 text-xs"
          style={{ color: theme.text.title }}
        >
          <div className="inline-flex items-center py-1">
            {nodes.length !== 0 ? (
              <>
                <div onClick={handleAddButtonClick} className="cursor-pointer">
                  <IconButton color="primary">
                    <AddIcon
                      fontSize={"small"}
                      style={{ fill: theme.text.secondary, fontSize: "1rem" }}
                    />
                  </IconButton>
                  Add Node
                </div>
              </>
            ) : (
              <div className="flex h-8 items-center justify-center">
                Click on Canvas to add Node
              </div>
            )}
          </div>
          <div className="flex items-center py-1 ">
            <Link href={toggle()}>
              <div className="flex cursor-pointer items-center py-1">
                <IconButton>
                  <SwitchAccessShortcutIcon
                    fontSize={"small"}
                    style={{
                      fill: theme.text.secondary,
                      fontSize: "1rem",
                    }}
                  />
                </IconButton>
                {isLetter ? <p>Numbered</p> : <p>Lettered</p>}
              </div>
            </Link>

            {nodes.length !== 0 && (
              <>
                {!isSave ? (
                  <div className="cursor-pointer" onClick={handleSaveClick}>
                    <IconButton color="primary">
                      <ContentPasteIcon
                        style={{ fill: theme.text.secondary, fontSize: "1rem" }}
                      />
                    </IconButton>
                    Save Graph
                  </div>
                ) : (
                  <div>
                    <IconButton color="primary">
                      <CheckIcon
                        style={{ fill: theme.text.secondary, fontSize: "1rem" }}
                      />
                    </IconButton>
                    Saved!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {nodes
          .sort((a, b) => a.val - b.val)
          .map((node) => {
            return (
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
            );
          })}
      </div>
    </div>
  );
}
