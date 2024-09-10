"use client";
import MainPage from "~/components/graph-page/graph-page";
import { pageConfigurationPrimJarnik as pageConfiguration } from "~/app/_pageConfigs/config";

export default function PRIMJARNIKPage() {
  return <MainPage pageConfiguration={pageConfiguration} />;
}
