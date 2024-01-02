"use client";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function DFSPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const searchParams = useSearchParams()!;
  const isEditTest = searchParams.get("edit");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSVGClick = () => {
    setShowDiv(!showDiv);
  };

  return (
    <div className="relative flex h-screen flex-col bg-black">
      <Nav
        handleSVGClick={handleSVGClick}
        showMenu={showMenu}
        toggleMenu={toggleMenu}
      />

      <div className="relative h-full bg-black">
        {showMenu ? <ShowMenuItems /> : null}

        {showDiv && (
          <>
            <div className="absolute z-10 h-48 w-64 rounded-l-lg border-2 border-solid bg-black p-4">
              <p className="text-white">Div Content Here</p>
            </div>
            <div className="absolute left-64 z-10 h-48 w-64 rounded-r-lg border-2 border-solid bg-black p-4 ">
              <p className="text-white">Div Content Here</p>
            </div>
          </>
        )}
        {isEditTest ? <EditMode /> : <Animation />}
      </div>
    </div>
  );
}

const Animation = () => {
  return (
    <div className="absolute h-full w-full p-4">
      <div className="h-2/3 overflow-auto rounded-2xl bg-slate-600 sm:mb-2 md:relative md:left-0 md:top-0 md:w-[65%] lg:w-[70%]">
        <svg className="h-full w-full">
          {/*The nodes are slapped inside here/*/}
          <Nodes val={10} x={50} y={56} />
        </svg>
      </div>
      <div className="mt-2 h-1/3 rounded-2xl bg-green-500 md:h-1/3 md:w-[65%] lg:h-1/3 lg:w-[70%]"></div>
      <div className="mx-auto w-2/3 bg-pink-500 md:absolute md:right-0 md:top-4 md:mr-3 md:h-[calc(100%_-_1.5rem)] md:w-[33%] lg:mr-4 lg:w-[28%]"></div>
    </div>
  );
};

const EditMode = () => {
  return (
    <div className="absolute h-full w-full p-4">
      <div className="gridded mx-auto my-14 h-2/3 overflow-auto rounded-2xl bg-slate-600 md:relative md:left-0 md:top-0 md:w-[65%] lg:w-[70%]">
        <svg className="h-[900px]">{/* Nodes here */}</svg>
      </div>
    </div>
  );
};

interface NodeProps {
  x: number;
  y: number;
  val: number;
}

const Nodes: React.FC<NodeProps> = ({ x, y, val }) => {
  const DEFAULT_RADIUS_SMALL_CIRCLE = 16;
  const DEFAULT_RADIUS_BIG_CIRCLE = 18;
  return (
    <g>
      <circle
        name={"" + val}
        cx={x}
        cy={y}
        r={DEFAULT_RADIUS_SMALL_CIRCLE}
        fill={"blue"}
      />
      <circle
        name={"" + val}
        cx={x}
        cy={y}
        r={DEFAULT_RADIUS_BIG_CIRCLE}
        stroke="black"
        strokeWidth="3"
        fill={"blue"}
      />
    </g>
  );
};

interface NavProps {
  handleSVGClick: () => void;
  showMenu: boolean;
  toggleMenu: () => void;
}

const Nav: React.FC<NavProps> = ({ handleSVGClick, showMenu, toggleMenu }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const isEditTest = searchParams.get("edit");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          GraphQuest: DFS {windowWidth} {dimensionsConverter(windowWidth)}
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
              isEditTest === "true"
                ? pathname + "?" + deleteQueryString("edit")
                : pathname + "?" + createQueryString("edit", "true")
            }
          >
            <button className="rounded bg-white px-4 py-1 text-sm text-black transition duration-300 ease-in-out hover:bg-gray-400">
              {isEditTest ? "View Graph" : "Edit"}
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const ShowMenuItems = () => {
  return (
    <div className="absolute inset-0 z-20 bg-red-500 px-4 text-white lg:hidden">
      <div className=" border-b border-white py-3">
        <p>Menu Content Here</p>
      </div>
    </div>
  );
};

const dimensionsConverter = (x: number) => {
  return x <= 640
    ? "sm"
    : x <= 768
    ? "md"
    : x <= 1024
    ? "lg"
    : x <= 1280
    ? "xl"
    : "2xl";
};
