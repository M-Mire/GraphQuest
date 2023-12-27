import React from "react";

export default function MultiSwitcher() {
  return (
    <>
      <div className="absolute z-10 h-48 w-64 rounded-l-lg border-2 border-solid bg-black p-4">
        <p className="text-white">Div Content Here</p>
      </div>
      <div className="absolute left-64 z-10 h-48 w-64 rounded-r-lg border-2 border-solid bg-black p-4 ">
        <p className="text-white">Div Content Here</p>
      </div>
    </>
  );
}
