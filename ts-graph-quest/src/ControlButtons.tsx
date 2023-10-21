import React from 'react';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

const iconSize = "small"; // Use "small" for smaller icons
const paddingStyle = 'p-0.5'; // Adjust the padding as needed
const buttonMargin = 'm-1'; // Add margin between buttons

const ControlButtons: React.FC = () => {
  return (
    <div className="w-full h-12 flex justify-center items-end mt-2">
      <div className="bg-white rounded-t-lg shadow-md p-1 rounded-b-lg">
        <div className="flex justify-between">
          <div className={`control-button-bg bg-green-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary" >
              <PlayArrowIcon fontSize={iconSize} style={{ fill: "#FFF" }} />
            </IconButton>
          </div>
          <div className={`control-button-bg bg-yellow-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary">
              <PauseIcon fontSize={iconSize} style={{fill:"#FFF"}}/>
            </IconButton>
          </div>
          <div className={`control-button-bg bg-red-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary" >
              <FastRewindIcon fontSize={iconSize} style={{fill:"#FFF"}}/>
            </IconButton>
          </div>
          <div className={`control-button-bg bg-blue-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary">
              <FastForwardIcon fontSize={iconSize} style={{fill:"#FFF"}}/>
            </IconButton>
          </div>
         
          <div className={`control-button-bg bg-purple-500 rounded-full ${paddingStyle} ${buttonMargin}`}>
            <IconButton color="primary" >
              <RotateLeftIcon fontSize={iconSize} style={{fill:"#FFF"}}/>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;
