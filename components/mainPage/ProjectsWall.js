"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import projects from "@/data/projects.json";
import imageDimensions from "@/data/imageDimensions.json";
import { saveHomeScrollPosition } from "@/lib/homeScrollMemory";
import MasonryGrid, { sortByAspect } from "@/components/shared/MasonryGrid";

function getProjectCover(images = []) {
  return images.find((img) => img.includes("-cover")) || images[0];
}

export default function ProjectsWall() {
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef([]);
  const hasAnimatedRef = useRef(false);
  const skipAnimationRef = useRef(false);

  // ── Skip animation when navigating back (already played) ────────────────
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__projectsWallAnimated !== true) return;
    skipAnimationRef.current = true;
    cardRefs.current.filter(Boolean).forEach((el) => {
      el.classList.remove("wall-card");
      el.classList.add("wall-static");
    });
  }, []);

  // ── IntersectionObserver entrance animation ──────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || skipAnimationRef.current) return;

    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    if (window.__projectsWallAnimated === true) {
      cards.forEach((el) => {
        el.classList.remove("wall-card");
        el.classList.add("wall-static");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      requestAnimationFrame(() =>
        cards.forEach((el) => el.classList.add("wall-animate"))
      );
      window.__projectsWallAnimated = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("wall-animate");
          if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            window.__projectsWallAnimated = true;
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Mobile detection (controls slide-in direction) ───────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // ── Build & sort items ───────────────────────────────────────────────────
  const items = useMemo(() => {
    // 1. Build raw items with dimensions
    const raw = projects.map((project) => {
      const cover = getProjectCover(project.images);
      const dimensionKey = `projects/${project.slug}/${cover}`;
      return {
        key: project.slug,
        src: `/projects/${project.slug}/${cover}`,
        alt: `${project.title} cover`,
        dimensions: imageDimensions[dimensionKey] || { width: 700, height: 500 },
        href: `/projects/${project.slug}`,
        overlay: { title: project.title, description: project.description },
        onLinkClick: saveHomeScrollPosition,
      };
    });

    // 2. Sort: landscape covers first, portrait last
    const sorted = sortByAspect(raw);

    // 3. Attach animation / ref props keyed to sorted index
    const slideDirections = isMobile
      ? [{ x: 0, y: 24 }]                            // mobile: slide up only
      : [{ x: -80, y: 0 }, { x: 80, y: 0 }];         // desktop: alternate L/R

    return sorted.map((item, si) => {
      const dir = slideDirections[si % slideDirections.length];
      return {
        ...item,
        priority: si < 2,
        wrapperClassName:
          "wall-card [break-inside:avoid] [page-break-inside:avoid] [column-break-inside:avoid] align-top",
        wrapperStyle: {
          "--from-x": `${dir.x}px`,
          "--from-y": `${dir.y}px`,
          "--wall-delay": `${si * 120}ms`,
        },
        itemRef: (el) => {
          cardRefs.current[si] = el;
        },
      };
    });
  }, [isMobile]);

  return (
    <section className="section bg-cream overflow-x-hidden">
      <div className="container mx-auto">
        <h2 className="mb-10 section-title">Books</h2>

        <MasonryGrid
          items={items}
          columns={{ default: 3, 1024: 2, 776: 1 }}
   
        />
      </div>
    </section>
  );
}