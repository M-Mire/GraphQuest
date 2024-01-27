import { ReactNode } from "react";
import { useThemeContext } from "~/app/context/ThemeContext";
interface InformationBoardProps {
  minCanvas: { minHeight: number; minWidth: number };
  children?: ReactNode;
}

const InformationBoard: React.FC<InformationBoardProps> = ({
  minCanvas,
  children,
}) => {
  const { theme } = useThemeContext();
  return (
    <div
      className="flex h-[50px] justify-evenly border-b-2"
      style={{
        borderColor: theme.background.quaternary,
        background: theme.background.tertiary,
        minWidth: `${
          minCanvas.minWidth ? `${minCanvas.minWidth + 16}px` : "100%"
        }`,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default InformationBoard;
