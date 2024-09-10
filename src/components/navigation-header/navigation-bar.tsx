import React from "react";
import Link from "next/link";
import { ThemeToggle } from "../../app/_components/theme-toggle/toggle-button";
import pageConfigurationType from "~/app/_pageConfigs/config";
import ToggleMode from "./ToggleMode";
import BurgerMenu from "./burger-menu/burger-menu";

interface NavigationBarProps {
  algorithmName?: string;
  pageConfiguration?: pageConfigurationType;
  children?: React.ReactNode;
  explorersMode?: boolean;
}

export const NavigationBar = ({
  algorithmName,
  children,
  pageConfiguration,
}: NavigationBarProps) => {
  return (
    <header
      className={`main-nav-container bg-border-b top-0 z-[9999] w-full border-border/40 bg-background/95 backdrop-blur transition-transform duration-300`}
    >
      <div className="relative flex h-20 flex-wrap items-center justify-between px-4 md:px-6">
        <div className="relative flex flex-1 items-center space-x-3 rtl:space-x-reverse md:flex-none">
          <span className="my-auto flex text-xl font-black">
            <Link href="/">GraphQuest</Link>
            {pageConfiguration && algorithmName && `:${algorithmName}`}
          </span>
          <div
            className="hidden items-center justify-between md:order-1 md:flex md:w-auto"
            id="navbar-sticky"
          >
            {children}
          </div>
        </div>
        <div className="relative flex space-x-2 rtl:space-x-reverse md:order-2">
          {pageConfiguration && <ToggleMode />}
          <ThemeToggle />
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
