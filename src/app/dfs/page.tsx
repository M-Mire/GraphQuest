"use client";
import MainPage from "~/components/graph-page/graph-page";
import { pageConfigurationDFS as pageConfiguration } from "~/app/_pageConfigs/config";

export default function DFSPage() {
  return <MainPage pageConfiguration={pageConfiguration} />;
}
