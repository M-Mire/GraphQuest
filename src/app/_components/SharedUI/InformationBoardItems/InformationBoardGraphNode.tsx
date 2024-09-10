interface InformationBoardGraphNodeProps {
  text: string;
  classname: string;
}
const InformationBoardGraphNode: React.FC<InformationBoardGraphNodeProps> = ({
  text,
  classname,
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
            strokeWidth="3"
            className={classname}
          />
        </svg>
      </div>

      <div className="text-md ml-1 flex items-center">{text}</div>
    </div>
  );
};
export default InformationBoardGraphNode;
