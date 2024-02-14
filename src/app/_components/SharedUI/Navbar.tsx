import { useState } from "react";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { useThemeContext } from "~/app/context/ThemeContext";
import Themes from "./NavItems/Themes";
import PageMenu from "./PageMenu";
import pageConfigurationType from "~/app/_pageConfigs/config";
import ToggleMode from "./NavItems/ToggleMode";
import ShowMenuItems from "./NavItems/ShowMenuItems";
import Link from "next/link";

export interface NavbarProps {
  algorithmName?: string;
  pageConfiguration?: pageConfigurationType;
  children?: React.ReactNode;
  explorersMode?: boolean;
}
const Navbar: React.FC<NavbarProps> = ({
  algorithmName,
  children,
  pageConfiguration,
}) => {
  const { theme } = useThemeContext();

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const [isPageMenuActive, setPageMenu] = useState(false);
  const handleSVGClick = () => {
    setPageMenu(!isPageMenuActive);
  };

  return (
    <>
      {isPageMenuActive && (
        <>
          <PageMenu
            pageConfiguration={pageConfiguration}
            setPageMenu={setPageMenu}
          />
        </>
      )}
      <nav
        className="flex h-16 items-center justify-between border-b-2 border-gray-600 px-4 py-4"
        style={{ background: theme.background.tertiary }}
      >
        <div className="flex items-center">
          <div
            className="text-sm font-bold "
            style={{ color: theme.text.title }}
          >
            <Link href="/">
              <AccountTreeIcon fontSize="medium" />
            </Link>
          </div>
          <div
            className="ml-2 flex items-center text-sm font-bold "
            style={{ color: theme.text.title }}
          >
            GraphQuest
            {pageConfiguration && algorithmName && `:${algorithmName}`}
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

          {children}
          {showMenu ? <ShowMenuItems /> : null}
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
          {pageConfiguration && (
            <li>
              <ToggleMode />
            </li>
          )}

          <li className="ml-2">
            <IconButton
              color="primary"
              size="small"
              style={{ color: theme.background.quaternary }}
            >
              <Themes />
            </IconButton>
          </li>
          <li className="">
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
    </>
  );
};

export default Navbar;
