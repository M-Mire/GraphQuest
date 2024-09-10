import { nanoid } from "nanoid";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
}

const SearchInput = ({ query, setQuery }: SearchInputProps) => {
  const inputId = `search-input-${nanoid()}`;

  return (
    <div className="flex h-12 w-full items-center justify-between border-b-2 border-solid border-inherit">
      <div className="flex items-center">
        <SearchIcon style={{ fontSize: "1.5rem" }} className="ml-4 mr-1" />
        <input
          id={inputId}
          name={inputId}
          placeholder="Find Algorithm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-40 bg-inherit  placeholder-slate-500 focus:outline-none"
          autoFocus
        />
      </div>
    </div>
  );
};

export default SearchInput;
