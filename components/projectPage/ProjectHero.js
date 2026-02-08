"use client";

import Image from "next/image";

function getHeroImage(images = []) {
  return images.find((image) => image.startsWith("01")) || images[0];
}

export default function ProjectHero({ project, folder }) {
  const heroImage = getHeroImage(project.images);
  const metaLine = [project.client, project.year].filter(Boolean).join(" • ");
  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--spot-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--spot-y", `${y.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--spot-opacity", "1");
  };

  const handleHeroEnter = (event) => {
    event.currentTarget.style.setProperty("--spot-opacity", "1");
  };

  const handleHeroLeave = (event) => {
    event.currentTarget.style.setProperty("--spot-opacity", "0");
  };
  return (
    <section className="section md:min-h-screen pt-8 pb-10 md:pt-[var(--section-y)] md:pb-[var(--section-y)]">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div
          className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0"
          style={{ animation: "fadeInUp 0.8s ease both" }}
        >
          <div className="flex flex-col gap-3 md:hidden text-center items-center">
            <h1
              className="t-section"
              style={{
                fontFamily: "var(--font-fun), ui-sans-serif, sans-serif",
              }}
            >
              {project.title}
            </h1>
          </div>

          <div
            className="w-full md:flex-none md:w-[min(78vw,1180px)]"
            style={{ animation: "fadeIn 0.9s ease both", animationDelay: "80ms" }}
          >
            <div
              className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:h-[70vh] lg:h-[78vh] overflow-hidden img-rounded md:rounded-r-none hero-frame"
              onMouseEnter={handleHeroEnter}
              onMouseMove={handleHeroMove}
              onMouseLeave={handleHeroLeave}
            >
              <div className="hero-image-wrap">
                <Image
                  src={`/projects/${folder}/${heroImage}`}
                  alt={`${project.title} hero`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain hero-image"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-1 hero-copy md:h-[70vh] lg:h-[78vh] md:justify-center md:rounded-l-none">
            <h1
              className="t-section hidden md:block"
              style={{
                fontFamily: "var(--font-fun), ui-sans-serif, sans-serif",
              }}
            >
              {project.title}
            </h1>
            <p className="t-body text-foreground/85 hidden md:block">
              {project.description}
            </p>
            {metaLine && (
              <p className="text-sm md:text-base text-foreground/60 hidden md:block">
                {metaLine}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 md:hidden text-center items-center hero-copy w-full">
            <p className="t-body text-foreground/85">
              {project.description}
            </p>
            {metaLine && (
              <p className="text-sm text-foreground/60">{metaLine}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
