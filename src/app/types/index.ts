export interface Theme {
  name: string;
  background: {
    primary: string; //Main background colour
    secondary: string; // Canvas background colour
    tertiary: string; // Navbar background colour
    quaternary: string; // border colour
  };
  text: {
    title: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
  node: {
    unvisited: string;
    visited: string;
    completed: string;
    active: string;
    root: string;
    rootStroke: string;
    text: string;
    defaultStroke: string;
  };
  edge: {
    color: string;
  };
  code: {
    highlight: string;
    style: React.CSSProperties;
  };
}

export type NodeType = "visited" | "normal" | "shortestPath";

export type GridNode = {
  row: number;
  col: number;
  type: NodeType;
  isStart: boolean;
  isEnd: boolean;
  previousNode: GridNode | null;
  isBlock: boolean;
  distance: number;
  gScore: number;
  fScore: number;
  isCost: boolean;
};

export type Grid = GridNode[][];

export type MousePressedNode = "start" | "end" | "normal";

export type GifType = {
  title: string;
  text: string;
  img: string;
  description: string;
};
