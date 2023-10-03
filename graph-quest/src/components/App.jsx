import { useState } from "react";
import Navbar from "./Navbar";
import Animation from "./Animation";
import EditMode from "./EditMode";
const App = () => {
  const [isEditMode, setEditMode] = useState(false);

  return (
    <div className="app">
      <Navbar />
      {!isEditMode ? (
        <Animation
          enableEditMode={() => {
            setEditMode(true);
          }}
        />
      ) : (
        <EditMode
          enableEditMode={() => {
            setEditMode(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
