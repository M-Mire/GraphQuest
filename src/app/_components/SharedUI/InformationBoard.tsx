import { ReactNode } from "react";

interface InformationBoardProps {
  minCanvas?: { minHeight: number; minWidth: number };
  children?: ReactNode;
}

const InformationBoard: React.FC<InformationBoardProps> = ({
  minCanvas,
  children,
}) => {
  return (
    <div
      className="flex h-[50px] justify-evenly border-b-2 bg-secondary"
      style={{
        minWidth: minCanvas ? `${minCanvas.minWidth + 16}px` : "100%", // Set a default value if minCanvas is not provided
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default InformationBoard;
