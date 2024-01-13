import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import IconButton from "@mui/material/IconButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckIcon from "@mui/icons-material/Check";

interface TraverseCodeProps {
  lineNumbers: number[];
  code: string;
  algorithmName: string;
}
const iconSize = "small";
const TraverseCode: React.FC<TraverseCodeProps> = ({
  lineNumbers,
  code,
  algorithmName,
}) => {
  const [isCopy, setCopy] = useState<boolean>(false);
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopy(true);
      setTimeout(() => {
        setCopy(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };
  return (
    <div className="mt-6 rounded-md bg-[#40454A] md:mt-0">
      <div className="flex items-center justify-between px-4 text-xs text-white">
        <p>{algorithmName}</p>
        {isCopy ? (
          <div className="inline-flex items-center py-1">
            <IconButton color="primary">
              <CheckIcon
                fontSize={iconSize}
                style={{ fill: "#FFF", fontSize: "1rem" }}
              />
            </IconButton>
            Copied!
          </div>
        ) : (
          <div
            className="inline-flex items-center py-1"
            onClick={handleCopyClick}
          >
            <IconButton color="primary">
              <ContentPasteIcon
                fontSize={iconSize}
                style={{ fill: "#FFF", fontSize: "1rem" }}
              />
            </IconButton>
            Copy Code
          </div>
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
          const style: React.CSSProperties = {
            display: "block",
            width: "fit-content",
          };
          lineNumbers.forEach((line) => {
            if (line === lineNumber) {
              style.backgroundColor = "#FFDB81";
            }
          });
          return { style };
        }}
        className={"syntax-highlighter"}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default TraverseCode;
