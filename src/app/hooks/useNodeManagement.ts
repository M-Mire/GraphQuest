// useNodeManagement.tsx
import { useEffect, useReducer, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ACTIONS_NODE } from "~/app/_components/GraphUI/NodeElement";
import type { ActionNode } from "~/app/_components/GraphUI/NodeElement";
import { Command } from "~/app/_GraphAlgorithm/Graph";
import type Node from "~/app/model/Node";

const useNodeManagement = () => {
  const searchParams = useSearchParams();
  const urlNodes = searchParams?.getAll("node") || [];
  const hasAddedNodesFromURL = useRef(false);

  const nodeReducer: React.Reducer<Node[], ActionNode> = (nodes, action) => {
    switch (action.type) {
      case ACTIONS_NODE.TEST_NODE_DIAGNOSTIC:
        console.log(nodes);
        return nodes;
      case ACTIONS_NODE.ADD_NODE:
        const newNode = action.payload as Node;
        const nodeExists = nodes.some((node) => node.val === newNode.val);
        if (!nodeExists) {
          return [...nodes, newNode] as Node[];
        }
        return nodes;
      case ACTIONS_NODE.ADD_CHILD_NODE:
        const { parentNode, childNode, weight } = action.payload as {
          parentNode: number;
          childNode: number;
          weight: number;
        };
        return nodes.map((node) => {
          if (node.val === parentNode && !node.childNodes.includes(childNode)) {
            return {
              ...node,
              childNodes: [...node.childNodes, childNode],
              distances: [...node.distances, weight],
            };
          }
          return node;
        });

      case ACTIONS_NODE.REMOVE_CHILD_NODE:
        const { childRemove } = action.payload as {
          childRemove: number;
        };
        return nodes.map((node) => {
          if (node.childNodes.includes(childRemove)) {
            const childNodes = node.childNodes.filter(
              (val) => val !== childRemove,
            );
            const distances = node.distances.filter(
              (_, index) => node.childNodes[index] !== childRemove,
            );
            return { ...node, childNodes, distances };
          }
          return node;
        });

      case ACTIONS_NODE.DELETE_NODE:
        const { deleteId } = action.payload as {
          deleteId: string;
        };
        const nodeToDelete = nodes.find((node) => node.id === deleteId);
        if (!nodeToDelete) return nodes;
        const deleteVal = nodeToDelete.val;
        const filteredNodes = nodes.filter((node) => node.id !== deleteId);
        const updatedNodes = filteredNodes.map((parentNode) => ({
          ...parentNode,
          childNodes: parentNode.childNodes.filter(
            (childNode) => childNode !== deleteVal,
          ),
        }));
        return updatedNodes;

      case ACTIONS_NODE.NODE_ANIMATE:
        const { value, command } = action.payload as {
          value: number | number[];
          command: Command;
        };
        let pairValue: number[];
        switch (command) {
          case Command.Visited:
            return nodes.map((node) => {
              if (node.val === value) {
                return { ...node, visited: true };
              }
              return node;
            });
          case Command.Popped:
            return nodes.map((node) => {
              if (node.val === value) {
                return { ...node, visitedChildrens: true };
              }
              return node;
            });
          case Command.Unvisit:
            return nodes.map((node) => {
              if (node.val === value) {
                return { ...node, visited: false };
              }
              return node;
            });
          case Command.VisitPairs:
            pairValue = value as number[];
            return nodes.map((node) => {
              if (node.val === pairValue[0]) {
                const connectedTo = Array.isArray(node.connectedTo)
                  ? node.connectedTo
                  : [];
                return {
                  ...node,
                  connectedTo: [...connectedTo, pairValue[1]],
                } as Node;
              } else if (node.val === pairValue[1]) {
                const connectedTo = Array.isArray(node.connectedTo)
                  ? node.connectedTo
                  : [];
                return {
                  ...node,
                  connectedTo: [...connectedTo, pairValue[0]],
                } as Node;
              }
              return node;
            });
          case Command.UnvisitPairs:
            pairValue = value as number[];
            return nodes.map((node) => {
              if (node.val === pairValue[0]) {
                const connectedTo = Array.isArray(node.connectedTo)
                  ? node.connectedTo.filter((val) => val !== pairValue[1])
                  : [];
                return { ...node, connectedTo } as Node;
              } else if (node.val === pairValue[1]) {
                const connectedTo = Array.isArray(node.connectedTo)
                  ? node.connectedTo.filter((val) => val !== pairValue[0])
                  : [];
                return { ...node, connectedTo } as Node;
              }
              return node;
            });
          default:
            return nodes;
        }
      case ACTIONS_NODE.NODE_RESET:
        return nodes.map((node) => {
          return {
            ...node,
            visited: false,
            visitedChildrens: false,
            connectedTo: [],
          };
        });
      case ACTIONS_NODE.DELETE_ALL:
        return [] as Node[];
      case ACTIONS_NODE.NODE_DISTANCE:
        const {
          node,
          childNode: childVal,
          parsedDistance,
        } = action.payload as {
          node: Node;
          childNode: number;
          parsedDistance: number;
        };
        return nodes.map((n) => {
          if (n === node) {
            node.distances[node.childNodes.indexOf(childVal)] = parsedDistance;
            return n;
          }
          return n;
        });

      case ACTIONS_NODE.UPDATE_COORDS:
        const { val, x, y } = action.payload as {
          val: number;
          x: number;
          y: number;
        };
        return nodes.map((n) => {
          if (n.val === val) {
            return { ...n, x: x, y: y };
          }
          return n;
        });
      default:
        return nodes;
    }
  };

  const [nodes, dispatch] = useReducer(nodeReducer, [] as Node[]);

  const addNodesFromURL = (urlNodes: string[]) => {
    if (!hasAddedNodesFromURL.current && urlNodes.length > 0) {
      urlNodes.forEach((urlNode) => {
        const deserializedObj = JSON.parse(decodeURIComponent(urlNode)) as Node;
        const newNode = deserializedObj;
        newNode.visited = false;
        newNode.visitedChildrens = false;
        dispatch({
          type: ACTIONS_NODE.ADD_NODE,
          payload: newNode,
        });
      });
      hasAddedNodesFromURL.current = true;
    }
  };

  useEffect(() => {
    addNodesFromURL(urlNodes);
  }, [urlNodes]);

  return {
    nodes,
    dispatch,
  };
};

export default useNodeManagement;
