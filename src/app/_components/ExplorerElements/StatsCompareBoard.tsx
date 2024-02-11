import { AlgorithmEnum } from "~/app/_pageConfigs/configExplorer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface StatsCompareBoardProps {
  stats:
    | {
        name: string;
        value: number | string;
      }[]
    | null;
  selectedAlgorithm: AlgorithmEnum;
  setStatisticButton: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAlgorithm:
    | React.Dispatch<React.SetStateAction<AlgorithmEnum | null>>
    | undefined;
}
const StatsCompareBoard = ({
  stats,
  selectedAlgorithm,
  setStatisticButton,
  setSelectedAlgorithm,
}: StatsCompareBoardProps) => {
  const handleClose = () => {
    setStatisticButton(false);
  };
  const handleChange = () => {
    if (setSelectedAlgorithm) {
      setSelectedAlgorithm(null);
      setStatisticButton(false);
    }
  };
  return (
    <div className="z-5 absolute left-0 top-0 h-full  w-full bg-inherit opacity-90">
      <div className="flex h-full flex-col items-center justify-start">
        <div className="flex w-full items-center justify-between">
          <h1 className="mb-2 mt-4 flex-grow text-center text-white">
            Stats for {selectedAlgorithm}
            {setSelectedAlgorithm && (
              <p className="text-sm" onClick={handleChange}>
                Change Algorithm
              </p>
            )}
          </h1>
          <IconButton onClick={handleClose} style={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex w-full flex-wrap justify-center overflow-auto">
          {stats?.map((stat) => {
            return (
              <div
                className="m-2 flex h-32 w-full flex-col justify-between rounded-2xl border-2 hover:bg-opacity-25 sm:w-1/3 md:w-1/3 lg:w-1/4"
                key={stat.name}
              >
                <p className="m-2 flex justify-center text-white sm:text-sm md:text-sm  lg:text-xl">
                  {stat.name}
                </p>
                <h1 className="my-4 flex justify-center text-4xl text-white sm:text-2xl lg:text-4xl">
                  {stat.value}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default StatsCompareBoard;
