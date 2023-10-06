import { useState, useReducer } from "react";
import Navbar from "./Navbar";
import Animation from "./Animation";
import EditMode from "./EditMode";

export const ACTIONS = {
  ADD_NODE: "ADD_NODE",
};

function reducer(nodes, action) {
  switch (action.type) {
    case ACTIONS.ADD_NODE:
      const { x, y, val } = action.payload;
      return [
        ...nodes,
        {
          id: Date.now(),
          val: val,
          x: x,
          y: y,
          visited: false,
          queued: false,
        },
      ];
  }
}

const App = () => {
  const [isEditMode, setEditMode] = useState(true);
  const [nodes, dispatch] = useReducer(reducer, []);

  return (
    <div className="app">
      <Navbar />
      {!isEditMode ? (
        <Animation
          enableEditMode={() => {
            setEditMode(true);
          }}
          nodes={nodes}
        />
      ) : (
        <EditMode
          enableEditMode={() => {
            setEditMode(false);
          }}
          dispatch={dispatch}
          nodes={nodes}
        />
      )}
    </div>
  );
};

export default App;
