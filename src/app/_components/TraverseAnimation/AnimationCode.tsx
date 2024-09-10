import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import IconButton from "@mui/material/IconButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckIcon from "@mui/icons-material/Check";
import { nord, a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

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

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopy(true);
        setTimeout(() => {
          setCopy(false);
        }, 3000);
      },
      (error) => {
        console.error("Failed to copy text:", error);
      },
    );
  };

  return (
    <div className="mt-4 rounded-md border-2 bg-secondary md:mt-0">
      <div className="flex items-center justify-between px-4 text-xs ">
        <p>{algorithmName}</p>
        {isCopy ? (
          <div className="inline-flex items-center py-1">
            <IconButton color="primary">
              <CheckIcon
                fontSize={iconSize}
                className="fill-primary text-[1.6rem]"
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
                className="fill-primary text-[1rem]"
              />
            </IconButton>
            Copy Code
          </div>
        )}
      </div>

      {/* Light Mode Syntax Highlighter */}
      <div className="dark:hidden">
        <SyntaxHighlighter
          language="javascript"
          className="rounded-b-md"
          style={a11yLight}
          wrapLines={true}
          wrapLongLines={false}
          showLineNumbers={true}
          customStyle={{ fontSize: "15px" }}
          lineProps={(lineNumber) => {
            const style: React.CSSProperties = {
              display: "block",
              width: "fit-content",
            };
            lineNumbers.forEach((line) => {
              if (line === lineNumber) {
                style.backgroundColor = "#957FB8";
              }
            });
            return { style };
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Dark Mode Syntax Highlighter */}
      <div className="hidden dark:block">
        <SyntaxHighlighter
          language="javascript"
          className="rounded-b-md"
          style={nord}
          wrapLines={true}
          wrapLongLines={false}
          showLineNumbers={true}
          customStyle={{ fontSize: "15px" }}
          lineProps={(lineNumber) => {
            const style: React.CSSProperties = {
              display: "block",
              width: "fit-content",
            };
            lineNumbers.forEach((line) => {
              if (line === lineNumber) {
                style.backgroundColor = "#957FB8";
              }
            });
            return { style };
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default TraverseCode;
