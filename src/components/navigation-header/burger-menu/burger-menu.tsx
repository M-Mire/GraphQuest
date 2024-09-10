import { useState, useEffect, useMemo } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import {
  pageConfigurationMap,
  pageConfigurationType,
} from "~/app/_pageConfigs/config";
import SearchInput from "./search-input";
import ActionButton from "./action-button";

export const BurgerMenu = () => {
  const [query, setQuery] = useState<string>("");
  const [pageConfiguration, setPageConfiguration] = useState<
    pageConfigurationType | undefined
  >(undefined);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredAlgorithms = useMemo(() => {
    return Array.from(pageConfigurationMap).filter(([id, config]) =>
      config.algorithmName.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" type="button">
          <div id="nav-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Algorithms</SheetTitle>
          <SheetDescription>
            Search and select algorithms from the list below.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <SearchInput query={query} setQuery={setQuery} />

          <div style={{ maxHeight: "calc(100%", overflowY: "auto" }}>
            {!!filteredAlgorithms.length ? (
              filteredAlgorithms.map(([id, config], i) => (
                <div key={id} className="px-4">
                  <div
                    className={`group relative mt-2 flex w-full flex-col rounded p-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-secondary ${
                      i === filteredAlgorithms.length - 1 && "mb-2"
                    }`}
                  >
                    <p className="flex items-center justify-between">
                      {config.algorithmName}
                    </p>
                    <div className="top-full hidden flex-col p-2 group-hover:mt-2 group-hover:flex">
                      <ActionButton
                        pageConfiguration={pageConfiguration}
                        config={[id, config]}
                        type="top"
                      />
                      <ActionButton
                        pageConfiguration={pageConfiguration}
                        config={[id, config]}
                        type="bottom"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm">
                Your search for &quot;{query}&ldquo; algorithm was unsuccessful.
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BurgerMenu;
