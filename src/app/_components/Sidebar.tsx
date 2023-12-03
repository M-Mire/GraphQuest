import { useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

const whiteText = { color: "white" };

interface SidebarProps {
  setRootValue: React.Dispatch<React.SetStateAction<number | null>>;
  rootValue: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ setRootValue, rootValue }) => {
  const handleRootInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value);
    setRootValue(value);
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditTest = searchParams.get("edit");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name);

      return params.toString();
    },
    [searchParams],
  );

  // const editHref =
  //   isEditTest === undefined
  //     ? pathname + "?" + createQueryString("edit", "true")
  //     : pathname + "?" + deleteQueryString("edit");

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
          <Link
            href={
              isEditTest === "true"
                ? pathname + "?" + deleteQueryString("edit")
                : pathname + "?" + createQueryString("edit", "true")
            }
          >
            <EditIcon style={{ cursor: "pointer", color: "white" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
