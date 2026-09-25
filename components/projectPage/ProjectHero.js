"use client";

import Image from "next/image";
import imageDimensions from "@/data/imageDimensions.json";

function getHeroImage(images = []) {
  return images.find((image) => image.startsWith("01")) || images[0];
}

const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f2efe9" offset="20%" />
        <stop stop-color="#e8e2d9" offset="50%" />
        <stop stop-color="#f2efe9" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f2efe9" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  </svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function ProjectHero({ project, folder }) {
  const heroImage = getHeroImage(project.images);
  const metaLine = [project.client, project.year].filter(Boolean).join(" • ");
  const heroDimensionKey = `projects/${folder}/${heroImage}`;
  const heroDimensions = imageDimensions[heroDimensionKey] || { width: 1600, height: 1000 };
  const heroAspect = heroDimensions.width / heroDimensions.height;

  return (
    <section className="section py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile/Tablet: Title */}
        <div
          className="lg:hidden mb-8 text-center"
        >
          <h1 className="t-project mb-4">{project.title}</h1>
        </div>

        {/* Layout */}
        <div
          className="w-full"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start max-w-[2000px] mx-auto">

            {/* Hero Image */}
            <div
              className="w-full lg:flex-1 flex justify-center"
            >
              <div
                className="relative overflow-hidden img-rounded"
                style={{ width: `min(100%, ${75 * heroAspect}vh)` }}
              >
              <div
                className="relative w-full min-h-[200px]"
                style={{ aspectRatio: `${heroDimensions.width} / ${heroDimensions.height}` }}
              >
                  <Image
                    src={`/projects/${folder}/${heroImage}`}
                    alt={`${project.title} hero`}
                    fill
                    className="project-hero-image block object-fill"
                    sizes="(max-width: 768px) 92vw, (max-width: 1280px) 70vw, 60vw"
                    priority
                    quality={85}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(900, 900))}`}
                  />
                </div>
              </div>
            </div>

            {/* Text — Desktop */}
            <div
              className="hidden lg:flex lg:flex-col lg:w-[380px] xl:w-[420px] gap-6 lg:sticky lg:top-24"
            >
              <div>
                <h1 className="t-project mb-4">{project.title}</h1>
                {metaLine && (
                  <p className="t-body text-foreground/50 mb-6">{metaLine}</p>
                )}
              </div>
              <p className="t-body text-foreground/75">{project.description}</p>
            </div>

          </div>
        </div>

        {/* Mobile/Tablet: Description */}
        <div
          className="lg:hidden mt-8 text-center max-w-2xl mx-auto"
        >
          <p className="t-body text-foreground/75">{project.description}</p>
          {metaLine && (
            <p className="t-body text-foreground/50 mt-3">{metaLine}</p>
          )}
        </div>

      </div>
    </section>
  );
}
