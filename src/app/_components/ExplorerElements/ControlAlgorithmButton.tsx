import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MazeIcon from "@mui/icons-material/BorderClear";
import { AlgorithmEnum, algorithmMap } from "~/app/_pageConfigs/configExplorer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { ButtonExplorer } from "~/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";

interface ControlButtonsProps {
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isPlay: boolean;
  selectedAlgorithm: AlgorithmEnum | null;
  setSelectedAlgorithm: React.Dispatch<
    React.SetStateAction<AlgorithmEnum | null>
  >;
  isMaze: boolean;
  setMaze: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
}

const ControlAlgorithmButton: React.FC<ControlButtonsProps> = ({
  setPlay,
  isPlay,
  selectedAlgorithm,
  setSelectedAlgorithm,
  setMaze,
  setDeleteClicked,
  isEditMode,
}) => {
  const algorithmObjects = Object.entries(algorithmMap).map(
    ([name, algorithm]) => ({
      name,
      algorithm,
    }),
  );

  const [isOpen, setDropDown] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const handlePlayClick = () => {
    setPlay(true);
  };

  const handleMazeClick = () => {
    if (!isPlay) setMaze(true);
  };

  const handleDeleteClick = () => {
    setDeleteClicked(true);
  };

  useEffect(() => {
    if (isEditMode && isOpen) {
      setDropDown(false);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isPlay) {
      setDropDown(false);
    }
  }, [isPlay]);

  return (
    <div className="relative ml-5 flex items-center text-sm font-bold">
      <div className="ml-3 flex h-8 items-center rounded-l-lg border-2 bg-inherit">
        <div className="flex items-center rounded-full">
          <IconButton color="primary" size="small" onClick={handlePlayClick}>
            <PlayArrowIcon style={{ fontSize: "1rem" }} />
          </IconButton>
        </div>
      </div>

      {!isEditMode && (
        <Popover open={isOpen} onOpenChange={setDropDown}>
          <PopoverTrigger asChild>
            <ButtonExplorer
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className="h-8 w-[200px] justify-between"
            >
              {value
                ? algorithmObjects.find((algorithm) => algorithm.name === value)
                    ?.name
                : "Pick Algorithm"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </ButtonExplorer>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search algorithm..." />
              <CommandList>
                <CommandEmpty>No algorithm found.</CommandEmpty>
                <CommandGroup>
                  {algorithmObjects.map(({ name }) => (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setSelectedAlgorithm(currentValue as AlgorithmEnum);
                        setDropDown(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === name ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      <div
        className={`flex h-8 items-center border-y-2 ${
          !isEditMode && "border-l-2"
        }`}
      >
        <div className="flex items-center rounded-full">
          <IconButton
            color="primary"
            size="small"
            onClick={handleMazeClick}
            className="text-inherit"
          >
            <MazeIcon className="text-[1rem]" />
            <p className="ml-2 mr-2 text-sm">Maze</p>
          </IconButton>
        </div>
      </div>

      <div className="flex h-8 items-center rounded-r-lg border-2">
        <div className="flex items-center rounded-full">
          <IconButton
            color="primary"
            size="small"
            onClick={handleDeleteClick}
            className="text-inherit"
          >
            <DeleteForeverIcon className="text-[1rem] text-red-500" />
            <p className="ml-2 mr-2 text-sm">Clear</p>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ControlAlgorithmButton;
