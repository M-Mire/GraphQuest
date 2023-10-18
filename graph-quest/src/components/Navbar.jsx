import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useRef } from "react";

export default function Navbar({ isEditMode, rootNode, setRootNode }) {
  const inputRef = useRef(null);

  return (
    <div className="navbar">
      <h1>GraphQuest {rootNode}</h1>
      <PlayArrowIcon
        onClick={() => {
          if (!isEditMode) {
            setRootNode(inputRef.current.value);
          }
        }}
      />
      <label>
        root Node
        <input id="rootNode" name="rootNode" ref={inputRef} type="text" />
      </label>
    </div>
  );
}
