import { useMemo } from "react";
import pageConfigurationType, {
  pageConfigurationMap,
  pageEnum,
} from "~/app/_pageConfigs/config";
import DoneIcon from "@mui/icons-material/Done";

interface OptionsListProps {
  query: string;
  pageConfiguration?: pageConfigurationType;
  hoveredDiv: pageEnum | null;
  handleMouseEnter: (id: pageEnum | null) => void;
}

const OptionsList = ({
  query,
  pageConfiguration,
  hoveredDiv,
  handleMouseEnter,
}: OptionsListProps) => {
  // Memoize the filtered options array to improve performance
  const filteredAlgorithms = useMemo(() => {
    return Array.from(pageConfigurationMap).filter(([id, config]) =>
      config.algorithmName.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <div style={{ maxHeight: "calc(100% - 3rem)", overflowY: "auto" }}>
      {!!filteredAlgorithms.length ? (
        filteredAlgorithms.map(([id, config], i) => (
          <div key={id} className="px-4">
            <div
              className={`mt-2 flex w-full items-center justify-between p-1 ${
                pageConfiguration?.algorithmName === config.algorithmName
                  ? "rounded bg-gray-700"
                  : hoveredDiv === id
                  ? "rounded bg-gray-500"
                  : ""
              } ${i === filteredAlgorithms.length - 1 && "mb-2"}`}
              onMouseEnter={() => handleMouseEnter(id)}
            >
              <p>{config.algorithmName}</p>
              {pageConfiguration?.algorithmName === config.algorithmName && (
                <DoneIcon />
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="p-4 text-sm">
          Your search for &quot;{query}&ldquo; algorithm was unsuccessful
        </p>
      )}
    </div>
  );
};

export default OptionsList;
