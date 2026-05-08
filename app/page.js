import HeroBanner from "@/components/mainPage/HeroBanner";
import IllustrationsWall from "@/components/mainPage/IllustrationsWall";
import ProjectsWall from "@/components/mainPage/ProjectsWall";
import About from "@/components/mainPage/About";
import Contact from "@/components/Contact";
import HomeScrollRestore from "@/components/mainPage/HomeScrollRestore";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteName,
  url: absoluteUrl("/"),
  image: absoluteUrl("/olena_hero.jpg"),
  jobTitle: "Children's Book Illustrator",
  description: siteDescription,
  sameAs: [
    "https://linkedin.com/in/olena-oprich",
    "https://instagram.com/oprich.art",
  ],
};

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <HomeScrollRestore />
        {/* Hero Banner з анімованими фото */}
        <HeroBanner />

        <IllustrationsWall />

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
