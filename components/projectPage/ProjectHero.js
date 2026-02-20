"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [heroAspect, setHeroAspect] = useState(16 / 10);
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 50, y: 50 });
  const currentRef = useRef({ x: 50, y: 50 });
  
  const handleHeroMove = (event) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const rawX = ((event.clientX - rect.left) / rect.width) * 100;
    const rawY = ((event.clientY - rect.top) / rect.height) * 100;
    const x = Math.min(100, Math.max(0, rawX));
    const y = Math.min(100, Math.max(0, rawY));
    targetRef.current = { x, y };
  };

  const handleHeroEnter = (event) => {
    if (frameRef.current) {
      frameRef.current.style.setProperty("--spot-opacity", "1");
    }
    if (!rafRef.current) {
      const tick = () => {
        const frame = frameRef.current;
        if (!frame) {
          rafRef.current = null;
          return;
        }
        const current = currentRef.current;
        const target = targetRef.current;
        const nextX = current.x + (target.x - current.x) * 0.18;
        const nextY = current.y + (target.y - current.y) * 0.18;
        currentRef.current = { x: nextX, y: nextY };
        frame.style.setProperty("--spot-x", `${nextX.toFixed(2)}%`);
        frame.style.setProperty("--spot-y", `${nextY.toFixed(2)}%`);
        const offsetX = ((nextX - 50) / 50) * 20;
        const offsetY = ((nextY - 50) / 50) * 14;
        frame.style.setProperty("--img-x", `${offsetX.toFixed(2)}px`);
        frame.style.setProperty("--img-y", `${offsetY.toFixed(2)}px`);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleHeroLeave = (event) => {
    if (frameRef.current) {
      frameRef.current.style.setProperty("--spot-opacity", "0");
      frameRef.current.style.setProperty("--img-x", "0px");
      frameRef.current.style.setProperty("--img-y", "0px");
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    currentRef.current = { x: 50, y: 50 };
    targetRef.current = { x: 50, y: 50 };
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="section py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile/Tablet: Title First (shown below lg) */}
        <div 
          className="lg:hidden mb-8 text-center"
          style={{ animation: "fadeInUp 0.8s ease both" }}
        >
          <h1
            className="section-title mb-4"
          >
            {project.title}
          </h1>
        </div>

        {/* Desktop: Side by Side Layout */}
        <div 
          className="w-full"
          style={{ animation: "fadeInUp 0.8s ease both" }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start max-w-[2000px] mx-auto">
            {/* Hero Image */}
            <div
              className="w-full lg:flex-1 flex justify-center"
              style={{ animation: "fadeIn 0.9s ease both", animationDelay: "0.1s" }}
            >
              <div
                className="relative overflow-hidden img-rounded hero-frame project-hero-frame group"
                ref={frameRef}
                onMouseEnter={handleHeroEnter}
                onMouseMove={handleHeroMove}
                onMouseLeave={handleHeroLeave}
                style={{
                  width: `min(100%, ${75 * heroAspect}vh)`,
                  maxHeight: "75vh",
                }}
              >
                  <div
                    className="relative w-full hero-motion project-hero-motion"
                    style={{
                      aspectRatio: heroAspect,
                    }}
                    data-loaded="false"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[var(--radius-card)] bg-foreground/5 animate-pulse transition-opacity duration-500 data-[loaded=true]:opacity-0"
                  />
                    <Image
                      ref={imgRef}
                      src={`/projects/${folder}/${heroImage}`}
                      alt={`${project.title} hero`}
                      fill
                      className="hero-image project-hero-image block object-contain opacity-0 transition-[opacity,transform,filter] duration-700 ease-out data-[loaded=true]:opacity-100"
                      data-loaded="false"
                      sizes="(max-width: 768px) 92vw, (max-width: 1280px) 70vw, 60vw"
                      priority
                    quality={85}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(900, 900)
                    )}`}
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      if (naturalWidth && naturalHeight) {
                        setHeroAspect(naturalWidth / naturalHeight);
                      }
                      e.currentTarget.setAttribute("data-loaded", "true");
                      e.currentTarget.parentElement?.setAttribute(
                        "data-loaded",
                        "true"
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Text Content - Desktop Only (lg and above) */}
            <div 
              className="hidden lg:flex lg:flex-col lg:w-[380px] xl:w-[420px] gap-6 lg:sticky lg:top-24"
              style={{ animation: "fadeInUp 0.9s ease both", animationDelay: "0.2s" }}
            >
              <div>
                <h1
                  className="section-title mb-4"
                >
                  {project.title}
                </h1>
                {metaLine && (
                  <p className="text-base text-foreground/50 mb-6">
                    {metaLine}
                  </p>
                )}
              </div>
              
              <p className="text-lg xl:text-xl leading-relaxed text-foreground/75">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Description Below Image (shown below lg) */}
        <div 
          className="lg:hidden mt-8 text-center max-w-2xl mx-auto"
          style={{ animation: "fadeInUp 0.8s ease both", animationDelay: "0.3s" }}
        >
          <p className="t-body text-foreground/75">
            {project.description}
          </p>
          {metaLine && (
            <p className="text-sm text-foreground/50 mt-3">{metaLine}</p>
          )}
        </div>
      </div>

    </section>
  );
}
