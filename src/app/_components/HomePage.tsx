import Link from "next/link";
import { useThemeContext } from "../context/ThemeContext";
import useThemeBackground from "../hooks/useThemeBackground";
import Navbar from "./SharedUI/Navbar";
import ViewGraphAlgorithms from "./HomePageElements/ViewGraphAlgorithms";
import { useState } from "react";

const HomePage = () => {
  useThemeBackground();
  const { theme } = useThemeContext();
  const [isGraphListOpen, setGraphList] = useState<boolean>(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <div
        className="flex flex-grow flex-col items-center justify-around  md:flex-row"
        style={{ color: theme.text.tertiary, borderColor: theme.text.title }}
      >
        <div className="mt-8 text-center md:mt-0 md:w-1/2 md:text-left">
          <h1
            className="mb-4 text-4xl font-bold"
            style={{ color: theme.text.title }}
          >
            Welcome to GraphQuest: Adventures in Algorithmic Graph
          </h1>
          <p className="mb-4 text-lg">
            GraphQuest is a visualiser for graph algorithms designed to provide
            an intuitive and interactive learning experience for students. With
            GraphQuest, users can input graphs and choose from a variety of
            algorithms to visualise the results. Our user-friendly interface
            allows for easy exploration of algorithms, enabling students to gain
            a deeper understanding of graph algorithms through interactive
            visualisations.
          </p>
          <p className="mb-4 text-lg">
            Objectives: Enables users to explore algorithms through interactive
            visualisations that can be utilised by lecturers to enhance their
            teaching of graph algorithms.
          </p>
        </div>

        {isGraphListOpen ? (
          <ViewGraphAlgorithms setGraphList={setGraphList} />
        ) : null}

        <div className="my-2 h-64 w-64 rounded-2xl border-2 border-inherit md:order-1">
          <Link href={"/explorersMode"}>
            <div className="flex h-full items-center justify-center">
              <h2 className="text-center text-lg">Explorers Mode</h2>
            </div>
          </Link>
        </div>
        <div
          className=" mb-4 h-64 w-64  cursor-pointer rounded-2xl border-2 border-inherit md:order-2 md:mb-0 md:mr-4"
          onClick={() => setGraphList(true)}
        >
          <div className="flex h-full items-center justify-center">
            <h2 className="text-center text-lg">Graph Mode</h2>
          </div>
        </div>
      </div>

      <footer
        className=" py-4 text-center"
        style={{ color: theme.text.tertiary }}
      >
        <p>&copy; 2024 GraphQuest</p>
      </footer>
    </div>
  );
};

export default HomePage;
