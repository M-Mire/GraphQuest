interface TraverseCodeProps {
  rootValue: number | null;
}

const TraverseCode: React.FC<TraverseCodeProps> = ({ rootValue }) => {
  return (
    <div
      className="h-1/3 w-full bg-blue-200"
      onClick={() =>
        console.log(rootValue !== null && !isNaN(rootValue) ? rootValue : 0)
      }></div>
  );
};

export default TraverseCode;
