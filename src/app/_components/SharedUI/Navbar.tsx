import { useCallback } from "react";
import Link from "next/link";
import ControlButtons from "./ControlButtons";
import type { ActionNode } from "../GraphUI/NodeElement";
import type { ActionLine } from "../CanvasElements/Animation";
import { useSearchParams, usePathname } from "next/navigation";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

export interface NavbarProps {
  rootValue: number | null;
  setRootValue: React.Dispatch<React.SetStateAction<number | null>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  dispatch: React.Dispatch<ActionNode>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isPlay: boolean;
  dispatchLineNumbers: React.Dispatch<ActionLine>;
  algorithmName: string;
  handleSVGClick: () => void;
  showMenu: boolean;
  toggleMenu: () => void;
}
const Navbar: React.FC<NavbarProps> = ({
  rootValue,
  setRootValue,
  setSpeed,
  speed,
  dispatch,
  setCurrentIndex,
  setPlay,
  isPlay,
  dispatchLineNumbers,
  algorithmName,
  handleSVGClick,
  showMenu,
  toggleMenu,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const isEditMode = searchParams && searchParams.get("edit");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.append(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <nav className="flex h-16 items-center justify-between border-b-2 border-gray-600 bg-black px-4 py-4">
      <div className="flex items-center">
        <div className="text-sm font-bold text-white">
          <AccountTreeIcon fontSize="medium" />
        </div>
        <div className="ml-2 flex items-center text-sm font-bold text-white">
          GraphQuest: {algorithmName}
        </div>
        <div className="ml-1 flex items-center text-sm font-bold text-gray-200">
          <button
            className="rounded px-2 py-1 text-sm transition duration-300 ease-in-out hover:bg-gray-200"
            onClick={handleSVGClick}
          >
            <svg
              aria-hidden="true"
              height="16"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 16 24"
            >
              <path d="M13 8.517L8 3 3 8.517M3 15.48l5 5.517 5-5.517"></path>
            </svg>
          </button>
        </div>
        <ControlButtons
          rootValue={rootValue}
          setRootValue={setRootValue}
          setSpeed={setSpeed}
          speed={speed}
          dispatch={dispatch}
          setCurrentIndex={setCurrentIndex}
          setPlay={setPlay}
          isPlay={isPlay}
          dispatchLineNumbers={dispatchLineNumbers}
        />
      </div>
      <label
        htmlFor="menu-toggle"
        className="block cursor-pointer text-white md:hidden"
        onClick={toggleMenu}
      >
        {/* Rendering of "=" or 'X' icon */}
        {showMenu ? (
          <span onClick={toggleMenu}>&times;</span> // 'X' icon when menu is open
        ) : (
          <span>&#9776;</span> // Burger icon
        )}
      </label>
      <input
        type="checkbox"
        id="menu-toggle"
        className="hidden"
        defaultChecked={showMenu}
      />
      <ul
        className={`flex w-full md:flex md:w-auto md:items-center ${
          showMenu ? "block" : "hidden"
        }`}
        id="menu"
      >
        {/* Nav items */}
        <li>
          <Link
            href={
              isEditMode === "true"
                ? pathname + "?" + deleteQueryString("edit")
                : pathname + "?" + createQueryString("edit", "true")
            }
          >
            <button
              name="changeView"
              className="rounded bg-white px-4 py-1 text-sm text-black transition duration-300 ease-in-out hover:bg-gray-400"
            >
              {isEditMode ? "View Graph" : "Edit"}
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
