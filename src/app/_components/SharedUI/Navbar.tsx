import { useCallback } from "react";
import Link from "next/link";
import ControlButtons from "./ControlButtons";
import {
  ACTIONS_NODE,
  ActionNode,
} from "~/app/_components/GraphUI/NodeElement";
import type { ActionLine } from "../CanvasElements/Animation";
import { useSearchParams, usePathname } from "next/navigation";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { useThemeContext } from "~/app/context/ThemeContext";
import Themes from "./NavItems/Themes";

export interface NavbarProps {
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
  const { theme } = useThemeContext();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const isEditMode = searchParams?.get("edit");

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
    <nav
      className="flex h-16 items-center justify-between border-b-2 border-gray-600 px-4 py-4"
      style={{ background: theme.background.tertiary }}
    >
      <div className="flex items-center">
        <div
          className="text-sm font-bold "
          style={{ color: theme.text.title }}
          onClick={() => {
            dispatch({
              type: ACTIONS_NODE.TEST_NODE_DIAGNOSTIC,
              payload: NaN,
            });
          }}
        >
          <AccountTreeIcon fontSize="medium" />
        </div>
        <div
          className="ml-2 flex items-center text-sm font-bold "
          style={{ color: theme.text.title }}
        >
          GraphQuest: {algorithmName}
        </div>
        <div
          className="ml-1 flex items-center text-sm font-bold "
          style={{ color: theme.text.title }}
        >
          <button
            className={`rounded px-2 py-1 text-sm transition duration-300 ease-in-out hover:bg-[#9ea9b8]`}
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
          <span
            style={{ color: theme.background.quaternary }}
            onClick={toggleMenu}
          >
            &times;
          </span> // 'X' icon when menu is open
        ) : (
          <span style={{ color: theme.background.quaternary }}>&#9776;</span> // Burger icon
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
              className="rounded border-2 px-4 py-1  text-sm transition duration-300 ease-in-out hover:bg-gray-400"
              style={{
                background: theme.background.primary,
                color: theme.text.primary,
                borderColor: theme.background.quaternary,
              }}
            >
              {isEditMode ? "View Graph" : "Edit"}
            </button>
          </Link>
        </li>
        <li className="ml-2">
          <Themes />
        </li>
        <li className="ml-2">
          <IconButton
            color="primary"
            size="small"
            style={{ color: theme.background.quaternary }}
          >
            <HelpOutlineIcon style={{ fontSize: "2rem" }} />
          </IconButton>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
