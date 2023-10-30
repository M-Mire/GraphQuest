import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EditIcon from "@mui/icons-material/Edit";

const whiteText = { color: "white" };

interface SidebarProps {
  setRootValue: React.Dispatch<React.SetStateAction<number | null>>;
  toggleEdit: React.Dispatch<React.SetStateAction<boolean>>;
  rootValue: number | null;
  isEditMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  setRootValue,
  rootValue,
  toggleEdit,
  isEditMode,
}) => {
  const handleRootInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value);
    setRootValue(value);
  };

  return (
    <div className="h-full w-16 bg-atomOneDark">
      <div className="p-2 text-white">
        <div className="mb-4">
          <AccountTreeIcon fontSize="large" />
        </div>
        <Typography
          variant="body2"
          style={{ ...whiteText, textAlign: "center", marginTop: "8px" }}
        >
          Root Node
        </Typography>
        <TextField
          placeholder="Enter root number"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            style: whiteText,
            inputProps: { min: 0, style: whiteText },
          }}
          InputLabelProps={{ style: whiteText, shrink: true }}
          value={rootValue ?? ""}
          onChange={handleRootInputChange}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <EditIcon
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              toggleEdit(!isEditMode);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
