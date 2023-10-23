import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Line } from "../GraphAlgorithm/Graph";
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

const TraverseCode: React.FC<TraverseCodeProps> = ({ lineNumbers }) => {
  return (
    <div>
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
