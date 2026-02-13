import HeroBanner from "@/components/mainPage/HeroBanner";
import ProjectsWall from "@/components/mainPage/ProjectsWall";
import About from "@/components/mainPage/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div>
      <main>
        {/* Hero Banner з анімованими фото */}
        <HeroBanner />

        {/* Секція Projects Wall */}
        <ProjectsWall />

        {/* Секція About */}
        <About />

        {/* Секція Contact */}
        <Contact />
      </main>
    </div>
  );
}
