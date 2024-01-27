import { Theme } from "../types";
import {
  dracula,
  a11yDark,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CSSProperties } from "react";

const themes: Record<string, Theme> = {
  nightFox: {
    name: "Night Fox",
    background: {
      primary: "#192330",
      secondary: "#131a24",
      tertiary: "#AEAFB0",
      quaternary: "#9C78D6",
    },
    text: {
      title: "#131A24",
      primary: "#cdcecf",
      secondary: "#131A24",
    },
    node: {
      unvisited: "#ffffff",
      visited: "#C683D7",
      completed: "#718096",
      active: "#525CEB",
      root: "#ffffff",
      rootStroke: "#66CCCC",
    },
    edge: {
      color: "#AEAFB0",
    },
    code: {
      highlight: "#09b355",
      style: dracula as CSSProperties,
    },
  },
  kanagawa: {
    name: "Kanagawa",
    background: {
      primary: "#1F1F28",
      secondary: "#16161D",
      tertiary: "#C8C093",
      quaternary: "#957FB8",
    },
    text: {
      title: "#16161D",
      primary: "#957FB8",
      secondary: "#131A24",
    },
    node: {
      unvisited: "#ffffff",
      visited: "#C683D7",
      completed: "#718096",
      active: "#525CEB",
      root: "#ffffff",
      rootStroke: "#66CCCC",
    },
    edge: {
      color: "#C8C093",
    },
    code: {
      highlight: "#957FB8",
      style: a11yDark as CSSProperties,
    },
  },
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
    },
    node: {
      unvisited: "#ffffff",
      visited: "#C683D7",
      completed: "#718096",
      active: "#525CEB",
      root: "#ffffff",
      rootStroke: "#66CCCC",
    },
    edge: {
      color: "#98BB6C",
    },
    code: {
      highlight: "#957FB8",
      style: nord as CSSProperties,
    },
  },
};

export default themes;
