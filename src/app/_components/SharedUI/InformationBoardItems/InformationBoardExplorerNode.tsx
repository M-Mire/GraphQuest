interface InformationBoardExplorerNodeProps {
  name: string;
  nodeClassName: string;
}
const InformationBoardExplorerNode: React.FC<
  InformationBoardExplorerNodeProps
> = ({ name, nodeClassName }) => {
  return (
    <div className="flex">
      <div className="flex h-full w-[25px] items-center">
        <div
          className={`flex h-6 w-6 items-center justify-center border-2 border-zinc-50 ${nodeClassName}`}
        ></div>
      </div>
      <div className="text-md ml-1 flex items-center">{name}</div>
    </div>
  );
};
export default InformationBoardExplorerNode;
