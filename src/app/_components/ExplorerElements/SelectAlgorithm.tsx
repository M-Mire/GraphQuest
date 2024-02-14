import { AlgorithmEnum, algorithmMap } from "~/app/_pageConfigs/configExplorer";
import { useThemeContext } from "~/app/context/ThemeContext";

interface SelectAlgorithmProps {
  setSelectedAlgorithm: React.Dispatch<
    React.SetStateAction<AlgorithmEnum | null>
  >;
  selectedAlgorithm: AlgorithmEnum | null;
}

const SelectAlgorithm = ({ setSelectedAlgorithm }: SelectAlgorithmProps) => {
  const { theme } = useThemeContext();
  const algorithmObjects = Object.entries(algorithmMap).map(
    ([name, algorithm]) => ({
      name,
      algorithm,
    }),
  );
  return (
    <div className="z-5 absolute left-0 top-0 h-full  w-full bg-inherit opacity-100">
      <div className="flex h-full flex-col items-center justify-start">
        <h1 className="mb-4 mt-4 text-white">Select Algorithm</h1>
        <div className="flex w-full flex-wrap justify-center overflow-auto">
          {algorithmObjects.map(({ name, algorithm: algorithm }, index) => (
            <button
              key={algorithm.name}
              className="m-2 flex h-32 w-full rounded-2xl border-2 hover:bg-opacity-25 sm:w-1/4"
              style={{ borderColor: theme.background.quaternary }}
              onClick={() => {
                setSelectedAlgorithm(algorithm.name as AlgorithmEnum);
              }}
            >
              <p
                className="m-auto"
                style={{ color: theme.background.quaternary }}
              >
                {name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectAlgorithm;
