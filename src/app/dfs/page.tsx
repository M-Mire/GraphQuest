"use client";
import MainPage from "~/app/_components/Pages/MainPage";
import { pageConfigurationDFS as pageConfiguration } from "~/app/_pageConfigs/config";

export default function DFSPage() {
  return (
    <>
      <MainPage pageConfiguration={pageConfiguration} />
    </>
  );
}
