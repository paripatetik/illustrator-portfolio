"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import projects from "@/data/projects.json";

function getProjectCover(images = []) {
  return images.find((image) => image.includes("-cover")) || images[0];
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

export default function ProjectsWall() {
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef([]);

  // Animate cards when they enter the viewport
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    if (!("IntersectionObserver" in window)) {
      requestAnimationFrame(() => {
        cards.forEach((card) => card.classList.add("wall-animate"));
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wall-animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // Detect mobile for animation direction
  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className="section bg-cream">
      <div className="container mx-auto px-4 pt-2">
        <div className="flex flex-wrap items-end mb-10">
          <div className="hidden md:block md:flex-1"></div>
          <h2 className="t-section uppercase italic w-full text-center md:w-auto md:flex-none">
            My Projects
          </h2>
          <span className="muted t-body w-full text-center md:w-auto md:flex-1 md:text-right">
            Selected illustration series
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const cover = getProjectCover(project.images);
            const coverSrc = `/projects/${project.slug}/${cover}`;
            
            // Animation directions for each column
            const desktopAlternate = [
              { x: -80, y: 0 }, // left
              { x: 80, y: 0 },  // right
            ];
            const mobilePattern = [
              { x: -70, y: 0 }, // left
              { x: 70, y: 0 },  // right
            ];
            
            const dir = isMobile
              ? mobilePattern[index % mobilePattern.length]
              : desktopAlternate[index % desktopAlternate.length];

            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group cursor-pointer"
              >
                <article
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="wall-card relative overflow-hidden rounded-[var(--radius-card)] bg-transparent"
                  style={{
                    "--from-x": `${dir.x}px`,
                    "--from-y": `${dir.y}px`,
                    "--wall-delay": `${index * 120}ms`,
                  }}
                >
                  <div className="relative w-full h-[260px] sm:h-[280px]">
                    <Image
                      src={coverSrc}
                      alt={`${project.title} cover`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-0 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] data-[loaded=true]:opacity-100 group-hover:scale-[1.015] transform-gpu will-change-transform"
                      data-loaded="false"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(700, 500)
                      )}`}
                      priority={index < 2}
                      quality={85}
                      onLoadingComplete={(img) => {
                        img.setAttribute("data-loaded", "true");
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/35 to-foreground/10 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-90"></div>

                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="t-project text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        {project.title}
                      </h3>
                      <p className="t-body text-white/95 mt-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out delay-75 translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @keyframes wallSlideIn {
          from {
            opacity: 0;
            transform: translate3d(
              var(--from-x, 0px),
              var(--from-y, 16px),
              0
            );
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .wall-card {
          opacity: 0;
          transform: translate3d(var(--from-x, 0px), var(--from-y, 16px), 0);
          will-change: transform, opacity;
        }

        .wall-card.wall-animate {
          animation: wallSlideIn 0.95s cubic-bezier(0.2, 0.8, 0.2, 1)
            var(--wall-delay, 0ms) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .wall-card {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
