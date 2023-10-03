import { useState } from "react";
import Navbar from "./Navbar";
import Animation from "./Animation";
import EditMode from "./EditMode";
const App = () => {
  const [isEditMode, setEditMode] = useState(false);

  return (
    <div className="app">
      <h1
        onClick={() => {
          setEditMode(!isEditMode);
        }}>
        Switch
      </h1>

      <Navbar />
      {!isEditMode ? (
        <Animation
          enableEditMode={() => {
            setEditMode(true);
          }}
        />
      ) : (
        <EditMode />
      )}
    </div>
  );
};

export default App;
