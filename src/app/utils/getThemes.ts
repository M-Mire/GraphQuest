import themes from "../themes/themes";
export const getThemes = () => {
  return Object.entries(themes).map(([name, theme]) => ({
    name,
    theme,
  }));
};
