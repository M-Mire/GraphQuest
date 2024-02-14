import { useThemeContext } from "~/app/context/ThemeContext";

const ShowMenuItems = () => {
  const { theme } = useThemeContext();
  return (
    <div
      className="absolute inset-0 z-20 px-4 text-white lg:hidden"
      style={{
        background: theme.background.quaternary,
        color: theme.background.secondary,
      }}
    >
      <div className=" border-b border-white py-3">
        <p>Menu Content Here</p>
      </div>
    </div>
  );
};

export default ShowMenuItems;
