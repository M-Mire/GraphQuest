import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const whiteText = { color: 'white' };

interface SidebarProps {
  setRootValue: (value: number | null) => void;
  rootValue: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({setRootValue,rootValue}) => {

  const handleRootInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setRootValue(value);
  };

  return (
    <div className="w-16 bg-gray-800">
      <div className="p-2 text-white">
        <div className="mb-4">
          <AccountTreeIcon fontSize="large" />
        </div>
        <Typography variant="body2" style={{ ...whiteText, textAlign: 'center', marginTop: '8px' }}>
          Root Node
        </Typography>
        <TextField
          placeholder="Enter root number"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            style: whiteText,
            inputProps: { min: 0, style: whiteText }
          }}
          InputLabelProps={{ style: whiteText, shrink: true }}
          value={rootValue || ''}
          onChange={handleRootInputChange}
        />
      </div>
    </div>
  );
};

export default Sidebar;
