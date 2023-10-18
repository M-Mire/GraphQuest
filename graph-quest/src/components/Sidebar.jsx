import React from "react";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Sidebar({ enableEditMode }) {
  return (
    <div className="sidebar">
      <span>
        <div className="a">
          <EditSharpIcon className="i" onClick={enableEditMode} />
        </div>
      </span>
      <span>
        <div className="a">
          <ShuffleIcon className="i" />
        </div>
      </span>
      <span>
        <div className="a">
          <DeleteForeverIcon className="i" />
        </div>
      </span>
    </div>
  );
}
