"use client";
import ExplorerModePage from "../../components/explorers-page/explorer-page";
import { useTheme } from "../hooks/useTheme";

export default function App() {
  const { theme, setTheme } = useTheme();
  return <ExplorerModePage />;
}
