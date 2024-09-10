"use client";
import { HeroSection } from "~/components/welcome-page/hero-section";
import { NavigationBar } from "~/components/navigation-header/navigation-bar";
import { Footer } from "~/components/welcome-page/footer";

const HomePage = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NavigationBar />
      <div className="flex flex-grow flex-col items-center justify-around  md:flex-row">
        <HeroSection />
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
