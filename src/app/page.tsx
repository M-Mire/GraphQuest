"use client";
import MainPage from "~/app/_components/MainPage";
import { pageConfigurationBFS as pageConfiguration } from "~/app/_pageConfigs/config";

export default function BFSPage() {
  return (
    <>
      <MainPage pageConfiguration={pageConfiguration} />
    </>
  );
}
