import Image from "next/image";
import HeroBanner from "@/components/mainPage/HeroBanner";

export default function Home() {
  return (
    <div>
      <main>
        {/* Hero Banner з анімованими фото */}
        <HeroBanner />
        
        {/* Секція Projects Wall (поки закоментована, додаси пізніше) */}
        {/* <ProjectsWall /> */}
        
        {/* Секція About (поки закоментована) */}
        {/* <About /> */}
        
        {/* Секція Contact (поки закоментована) */}
        {/* <Contact /> */}
      </main>
    </div>
  );
}