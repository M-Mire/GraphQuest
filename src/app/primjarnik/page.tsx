"use client";
import MainPage from "~/app/_components/MainPage";
import { pageConfigurationPrimJarnik as pageConfiguration } from "~/app/_pageConfigs/config";

export default function PRIMJARNIKPage() {
  return (
    <>
      <MainPage pageConfiguration={pageConfiguration} />
    </>
  );
}
