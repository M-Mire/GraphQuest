import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
export enum Alerts {
  Warning,
  Amber,
}
interface AlertProps {
  alert: Alerts | null;
  setAlert: React.Dispatch<React.SetStateAction<Alerts | null>>;
}
const CustomAlert: React.FC<AlertProps> = ({ alert, setAlert }) => {
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    let fadeOut: NodeJS.Timeout;
    if (alert === Alerts.Amber) {
      fadeOut = setTimeout(() => {
        setOpacity((prevOpacity) => {
          const newOpacity = prevOpacity - 0.1;
          return newOpacity >= 0 ? newOpacity : 0;
        });
      }, 500);
    }
    return () => clearTimeout(fadeOut);
  }, [alert, opacity]);

  useEffect(() => {
    if (opacity === 0) {
      setAlert(null);
    }
  }, [opacity]);

  const showAmberAlert = () => {
    setAlert(Alerts.Amber);
  };

  const handleWarningClose = () => {
    setAlert(null);
  };
  return (
    <>
      {alert !== null && (
        <div className="relative">
          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 transform"
            style={{ opacity: alert === Alerts.Amber ? opacity : 1 }}
          >
            {alert === Alerts.Warning ? (
              <Warning handleClick={handleWarningClose} />
            ) : alert === Alerts.Amber ? (
              <Amber />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomAlert;

interface WarningProps {
  handleClick: () => void;
}

const Warning: React.FC<WarningProps> = ({ handleClick }) => {
  return (
    <div
      className="relative rounded border border-red-400 bg-red-100 p-4 py-3 text-red-700"
      role="alert"
    >
      <div className="flex items-center justify-center">
        <div>
          <strong className="font-bold">Warning! </strong>
          <span className="block sm:inline">
            You&apos;ve reached the maximum limit of 20 nodes.
          </span>
        </div>
        <div className="ml-2">
          <IconButton color="primary" size="small" onClick={handleClick}>
            <CloseIcon
              fontSize="medium"
              style={{
                fill: "#B91C1A",
                position: "absolute",
                fontSize: "1.7rem",
              }}
            />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const Amber = () => {
  return (
    <div
      className="mt-2 rounded-b border-t-4 border-yellow-500 bg-yellow-100 px-4 py-3 text-teal-900 shadow-md"
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <svg
            className="mr-4 h-6 w-6 fill-current text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Information</p>
          <p className="text-sm">
            You can have up to 20 nodes. Ensure you manage them effectively.
          </p>
        </div>
      </div>
    </div>
  );
};
