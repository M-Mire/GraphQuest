// "use client";
// import themes from "../themes/themes";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { Theme } from "../types";

// interface ThemeContextProps {
//   theme: Theme;
//   setTheme: (value: Theme) => void;
// }
// export const ThemeContext = createContext<ThemeContextProps | undefined>(
//   undefined,
// );

// export function useThemeContext() {
//   const context = useContext(ThemeContext);

//   if (!context) {
//     throw new Error("useThemeContext must be used within ThemeContext");
//   }

//   return context;
// }

// const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   //TODO:
//   const { theme, setTheme } = useTheme(themes.nightFox!);

//   return (
//     <div>
//       <ThemeContext.Provider value={{ theme, setTheme }}>
//         {children}
//       </ThemeContext.Provider>
//     </div>
//   );
// };

// export const useLocalStorage = () => {
//   const setLocalStorageValue = (key: string, value: number | Theme) => {
//     try {
//       window.localStorage.setItem(key, JSON.stringify(value));
//     } catch (error) {
//       console.log("test set");
//     }
//   };

//   const getLocalStorageValue = (key: string) => {
//     try {
//       const value = window.localStorage.getItem(key);
//       // console.log("done", value);
//       return value ? JSON.parse(value) : null;
//     } catch (error) {
//       window.localStorage.getItem(key);
//     }
//   };

//   return { setLocalStorageValue, getLocalStorageValue };
// };

// export const useTheme = (initialTheme: Theme) => {
//   const { getLocalStorageValue, setLocalStorageValue } = useLocalStorage();

//   const [systemTheme, setSystemTheme] = useState<Theme>(() => {
//     const localTheme = getLocalStorageValue("theme");
//     return localTheme ? localTheme : initialTheme;
//   });

//   const setTheme = useCallback(
//     (value: Theme) => {
//       setSystemTheme(value);
//       setLocalStorageValue("theme", value);
//     },
//     [setSystemTheme, setLocalStorageValue],
//   );

//   return { theme: systemTheme, setTheme };
// };

// const Page = () => {
//   return (
//     <div>
//       <Header />
//       <Paragraph />
//       <ThemeSelector />
//     </div>
//   );
// };

// const Paragraph = () => {
//   const { theme } = useThemeContext();

//   return (
//     <p style={{ color: theme.text.primary }}>This is a sample paragraph.</p>
//   );
// };

// const Header = () => {
//   const { theme } = useThemeContext();

//   return (
//     <header
//       style={{ background: theme.background.primary, color: theme.text.title }}
//     >
//       <h1>Your Site Title</h1>
//     </header>
//   );
// };

// const ThemeSelector: React.FC = () => {
//   const { theme, setTheme } = useThemeContext();

//   const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setTheme(themes[event.target.value]!);
//   };

//   const currentThemeKey = Object.keys(themes).find(
//     (key) => themes[key]?.name === theme.name,
//   )!;

//   return (
//     <div>
//       <label htmlFor="themeSelector">Select Theme: </label>
//       <select
//         id="themeSelector"
//         onChange={handleThemeChange}
//         value={theme.name}
//       >
//         <option key={currentThemeKey} value={currentThemeKey}>
//           {themes[currentThemeKey]!.name}
//         </option>
//         {Object.keys(themes).map((key) => {
//           if (key !== currentThemeKey) {
//             return (
//               <option key={key} value={key}>
//                 {themes[key]!.name}
//               </option>
//             );
//           }
//         })}
//       </select>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <div>
//       <ThemeProvider>
//         <Page />
//       </ThemeProvider>
//     </div>
//   );
// };

// export default App;

const App = () => {
  return <></>;
};

export default App;
