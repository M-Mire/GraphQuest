interface InformationBoardNodeProps {
  name: string;
  colour: string;
  stroke?: string;
}
const InformationBoardNode: React.FC<InformationBoardNodeProps> = ({
  name,
  colour,
  stroke,
}) => {
  return (
    <div className="flex">
      <div className="flex h-full w-[30px] items-center">
        <svg>
          <circle
            name={`CIRCLE`}
            cx={15}
            cy={75}
            r={10}
            stroke={`${stroke ? stroke : "black"}`}
            strokeWidth="3"
            fill={colour}
          />
        </svg>
      </div>

      <div className="text-md ml-1 flex items-center">{name}</div>
    </div>
  );
};
export default InformationBoardNode;
