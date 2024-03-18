import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import IconButton from "@mui/material/IconButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckIcon from "@mui/icons-material/Check";
import { useThemeContext } from "~/app/context/ThemeContext";

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
  const { theme } = useThemeContext();
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
    <div
      className="mt-4 rounded-md border-2  md:mt-0"
      style={{ background: theme.background.tertiary }}
    >
      <div
        className="flex items-center justify-between px-4 text-xs "
        style={{ color: theme.text.title }}
      >
        <p>{algorithmName}</p>
        {isCopy ? (
          <div className="inline-flex items-center py-1">
            <IconButton color="primary">
              <CheckIcon
                fontSize={iconSize}
                style={{ fill: theme.text.secondary, fontSize: "1rem" }}
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
                style={{ fill: theme.text.secondary, fontSize: "1rem" }}
              />
            </IconButton>
            Copy Code
          </div>
        )}
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={theme.code.style as Record<string, React.CSSProperties>}
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
        className={"syntax-highlighter"}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default TraverseCode;
