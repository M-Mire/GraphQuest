import { useThemeContext } from "~/app/context/ThemeContext";
import SearchIcon from "@mui/icons-material/Search";
import { nanoid } from "nanoid";

interface SearchInputProps {
  setQuery: (value: React.SetStateAction<string>) => void;
  query: string;
}

const SearchInput = ({ setQuery, query }: SearchInputProps) => {
  const { theme } = useThemeContext();
  const inputId = `search-input-${nanoid()}`;
  return (
    <div className="flex h-12 w-full items-center justify-between border-b-2 border-solid border-inherit">
      <div className="flex items-center">
        <SearchIcon
          style={{ fill: theme.background.quaternary, fontSize: "1.5rem" }}
          className="ml-4 mr-1"
        />
        <input
          id={inputId}
          name={inputId}
          placeholder="Find Algorithm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-40 bg-inherit text-white placeholder-slate-500"
          autoFocus
        />
      </div>
      <div className="mr-2 flex items-center rounded-lg border-2 border-inherit p-[1px] text-xs">
        Esc
      </div>
    </div>
  );
};
export default SearchInput;
