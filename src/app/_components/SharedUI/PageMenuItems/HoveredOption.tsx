import pageConfigurationType, {
  pageConfigurationMap,
  pageEnum,
} from "~/app/_pageConfigs/config";
import BottomButton from "./BottomButton";
import TopButton from "./TopButton";

interface HoveredOptionProps {
  hoveredDiv: pageEnum | null;
  pageConfiguration?: pageConfigurationType;
}

const HoveredOption = ({
  hoveredDiv,
  pageConfiguration,
}: HoveredOptionProps) => {
  return (
    <>
      {hoveredDiv !== null &&
        Array.from(pageConfigurationMap).map(([id, config]) => (
          <div
            key={id}
            className="absolute left-64 z-10 mt-16 h-48 w-64 rounded-r-lg border-y-2 border-r-2 border-solid border-inherit bg-inherit"
            style={{
              display: hoveredDiv === id ? "block" : "none",
            }}
          >
            <div className="flex h-12 w-full justify-between border-b-2 border-solid border-inherit">
              <p className="m-auto">{id}</p>
            </div>

            <div className="px-4">
              <TopButton
                pageConfiguration={pageConfiguration}
                config={[id, config]}
              />
            </div>
            <div className="px-4 py-2">
              <BottomButton
                pageConfiguration={pageConfiguration}
                config={[id, config]}
              />
            </div>
          </div>
        ))}
    </>
  );
};

export default HoveredOption;
