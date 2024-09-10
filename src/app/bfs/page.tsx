"use client";
import MainPage from "~/components/graph-page/graph-page";
import { pageConfigurationBFS as pageConfiguration } from "~/app/_pageConfigs/config";

export default function BFSPage() {
  return <MainPage pageConfiguration={pageConfiguration} />;
}
