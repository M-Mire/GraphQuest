"use client";
import MainPage from "~/app/_components/MainPage";
import { pageConfigurationDijkstra as pageConfiguration } from "~/app/_pageConfigs/config";

export default function DijkstraPage() {
  return (
    <>
      <MainPage pageConfiguration={pageConfiguration} />
    </>
  );
}
