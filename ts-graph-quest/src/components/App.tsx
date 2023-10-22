import React, { useState, useReducer } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Canvas from './Canvas';
import TraverseCode from './TraverseCode';
import TraverseAnimation from './TraverseAnimation';
import EditMode from './EditMode';
import { ACTIONS_NODE, ActionNode, Node } from './NodeElement'

const nodeReducer: React.Reducer<Node[], ActionNode> = (nodes, action) => {
  switch (action.type) {
    case ACTIONS_NODE.ADD_NODE:
      return [...nodes, action.payload];
    case ACTIONS_NODE.ADD_CHILD_NODE:
      const { parentNode, childNode } = action.payload;
      return nodes.map((node) => {
        if (node.val === parentNode) {
          return { ...node, childNodes: node.childNodes.add(childNode) };
        }
        return node;
      });
    case ACTIONS_NODE.NODE_ANIMATE:
      return nodes;
    default:
      return nodes;
  }
};

const App: React.FC = () => {
  const [rootValue, setRootValue] = useState<number | null>(null);
  const [nodes, dispatch] = useReducer(nodeReducer, []);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [isEditMode, setEditMode] = useState<boolean>(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar setRootValue={setRootValue} rootValue={rootValue} toggleEdit={setEditMode} isEditMode={isEditMode} />
      <div className="flex-1">
        <Navbar />
        <div className="flex h-full">
          {!isEditMode ? (
            <>
              <Canvas />
              <div className="w-1/4 relative">
                <TraverseCode rootValue={rootValue} />
                <TraverseAnimation />
              </div>
            </>
          ) : (
            <EditMode dispatch={dispatch} nodes={nodes} nodeCount={nodeCount} incrementNodeCount={() => {
              setNodeCount(nodeCount + 1);
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
