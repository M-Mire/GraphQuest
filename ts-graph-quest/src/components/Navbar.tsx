import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ControlButtons from "./ControlButtons";
import { ActionNode } from "./NodeElement";
import { ActionLine } from "./Animation";

const navbarStyle = {
  backgroundColor: "transparent",
  color: "black",
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
};

const textWidthStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
};

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
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={navbarStyle}>
      <Toolbar>
        <div style={containerStyle}>
          <Typography variant="h6" component="div" style={textWidthStyle}>
            GraphQuest: Breadth-First Search
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleClick}
            aria-controls="simple-menu"
            aria-haspopup="true">
            <ExpandMoreIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <MenuItem onClick={handleClose}>Depth-first Search</MenuItem>
            <MenuItem onClick={handleClose}>Dijkstra's algorithm</MenuItem>
          </Menu>
        </div>
        <div className="flex-1"></div>
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
