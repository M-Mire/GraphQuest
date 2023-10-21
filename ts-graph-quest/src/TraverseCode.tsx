interface TraverseCodeProps {
  rootValue: number | null;
}

const TraverseCode: React.FC<TraverseCodeProps> = ({rootValue}) => {
  return (
    <div className="h-1/3 w-full bg-blue-200" onClick={()=>console.log(rootValue = rootValue ? rootValue : 0)}>
      {/* TraverseCode content goes here */}
    </div>
  );
};

export default TraverseCode;
