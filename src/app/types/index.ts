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
  };
  node: {
    unvisited: string;
    visited: string;
    completed: string;
    active: string;
    root: string;
    rootStroke: string;
  };
  edge: {
    color: string;
  };
  code: {
    highlight: string;
    style: React.CSSProperties;
  };
}
