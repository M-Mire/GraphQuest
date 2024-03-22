import { Theme } from "../types";
import {
  dracula,
  a11yDark,
  gruvboxLight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CSSProperties } from "react";

const themes: Record<string, Theme> = {
  nordic: {
    name: "Nordic",
    background: {
      primary: "#242933",
      secondary: "#191D24",
      tertiary: "#3B4252",
      quaternary: "#CF8670",
    },
    text: {
      title: "#98BB6C",
      primary: "#98BB6C",
      secondary: "#C6BE92",
      tertiary: "#CF8670",
    },
    node: {
      unvisited: "#ffffff",
      visited: "#824D74",
      completed: "#718096",
      active: "#525CEB",
      root: "#ffffff",
      rootStroke: "#66CCCC",
      text: "#C6BE92",
      defaultStroke: "#CF8670",
    },
    edge: {
      color: "#98BB6C",
    },
    code: {
      highlight: "#957FB8",
      style: nord as CSSProperties,
    },
  },
  cheeseCake: {
    name: "CheeseCake",
    background: {
      primary: "#FFF1CC",
      secondary: "#FFE0B2",
      tertiary: "#FFCC80",
      quaternary: "#FFB74D",
    },
    text: {
      title: "#FF5722",
      primary: "#FF5722",
      secondary: "#FFA726",
      tertiary: "#FFB74D",
    },
    node: {
      unvisited: "#FFFFFF",
      visited: "#FFD54F",
      completed: "#FFB74D",
      active: "#FF7043",
      root: "#FFFFFF",
      rootStroke: "#66CCCC",
      text: "#FFA726",
      defaultStroke: "#FFB74D",
    },
    edge: {
      color: "#FF5722",
    },
    code: {
      highlight: "#FFA000",
      style: gruvboxLight as CSSProperties,
    },
  },
};

export default themes;
