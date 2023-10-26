import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import IconButton from "@mui/material/IconButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckIcon from "@mui/icons-material/Check";

const code = `BFS(root: number) {
  const visited = new Set();
  const queue = [root];
  visited.add(root);

  while (queue.length > 0) {
    const vertex = queue.shift();
    for (const neighbour of this.graph.get(vertex) || []) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push(neighbour);
      }
    }
  }
}`;

interface TraverseCodeProps {
  lineNumbers: number[];
}
const iconSize = "small";
const TraverseCode: React.FC<TraverseCodeProps> = ({ lineNumbers }) => {
  const [isCopy, setCopy] = useState<boolean>(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };
  return (
    <div className="bg-[#40454A] rounded-md">
      <div className="flex justify-between px-4 text-xs items-center text-white">
        <p>Breadth-First Search</p>
        {isCopy ? (
          <button className="py-1 inline-flex items-center">
            <span className="text-base">
              <IconButton color="primary">
                <CheckIcon
                  fontSize={iconSize}
                  style={{ fill: "#FFF", fontSize: "1rem" }}
                />
              </IconButton>
            </span>
            Copied!
          </button>
        ) : (
          <button
            className="py-1 inline-flex items-center"
            onClick={handleCopyClick}>
            <span className="text-base">
              <IconButton color="primary">
                <ContentPasteIcon
                  fontSize={iconSize}
                  style={{ fill: "#FFF", fontSize: "1rem" }}
                />
              </IconButton>
            </span>
            Copy Code
          </button>
        )}
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={atomOneDark}
        wrapLines={true}
        wrapLongLines={false}
        showLineNumbers={true}
        customStyle={{ fontSize: "10px" }}
        lineProps={(lineNumber) => {
          const style: any = { display: "block", width: "fit-content" };
          lineNumbers.forEach((line) => {
            if (line === lineNumber) {
              style.backgroundColor = "#FFDB81";
            }
          });
          return { style };
        }}
        className={"syntax-highlighter"}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default TraverseCode;
