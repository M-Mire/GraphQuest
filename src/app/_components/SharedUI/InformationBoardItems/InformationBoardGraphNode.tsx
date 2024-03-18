import { useThemeContext } from "~/app/context/ThemeContext";

interface InformationBoardGraphNodeProps {
  name: string;
  colour: string;
  stroke?: string;
}
const InformationBoardGraphNode: React.FC<InformationBoardGraphNodeProps> = ({
  name,
  colour,
  stroke,
}) => {
  const { theme } = useThemeContext();
  return (
    <div className="flex">
      <div className="flex h-full w-[30px] items-center">
        <svg>
          <circle
            name={`CIRCLE`}
            cx={15}
            cy={75}
            r={10}
            stroke={`${stroke ? stroke : theme.node.defaultStroke}`}
            strokeWidth="3"
            fill={colour}
          />
        </svg>
      </div>

      <div
        className="text-md ml-1 flex items-center"
        style={{ color: theme.node.text }}
      >
        {name}
      </div>
    </div>
  );
};
export default InformationBoardGraphNode;
