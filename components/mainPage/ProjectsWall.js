"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import projects from "@/data/projects.json";
import imageDimensions from "@/data/imageDimensions.json";
import { saveHomeScrollPosition } from "@/lib/homeScrollMemory";
import MasonryGrid, { sortByAspect } from "@/components/shared/MasonryGrid";

function getProjectCover(images = []) {
  return images.find((img) => img.includes("-cover")) || images[0];
}

export default function ProjectsWall() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 639px)").matches;
  });

  const cardRefs = useRef([]);
  const observerRef = useRef(null);

  // ── Mobile detection on resize ───────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // ── Створюємо observer один раз ──────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("wall-animate");
          observerRef.current?.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px 60px 0px" }
    );

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  // ── itemRef винесено окремо ──────────────────────────────────────────────
  const makeItemRef = useCallback((si) => (el) => {
    const prev = cardRefs.current[si];
    if (prev) observerRef.current?.unobserve(prev);

    cardRefs.current[si] = el;
    if (!el) return;

    if (observerRef.current) {
      observerRef.current.observe(el);
    } else {
      el.classList.add("wall-animate");
    }
  }, []); // refs не змінюються → залежностей немає

  // ── Build & sort items ───────────────────────────────────────────────────
  const items = useMemo(() => {
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

    const sorted = sortByAspect(raw);

    const slideDirections = isMobile
      ? [{ x: 0, y: 24 }]
      : [{ x: -80, y: 0 }, { x: 80, y: 0 }];

    return sorted.map((item, si) => {
      const dir = slideDirections[si % slideDirections.length];
      return {
        ...item,
        priority: si < 2,
        wrapperClassName: "wall-card [break-inside:avoid] [page-break-inside:avoid] [column-break-inside:avoid] align-top",
        wrapperStyle: {
          "--from-x": `${dir.x}px`,
          "--from-y": `${dir.y}px`,
          "--wall-delay": `${si * 120}ms`,
        },
        itemRef: makeItemRef(si), // ← чиста функція, без side effects
      };
    });
  }, [isMobile, makeItemRef]);

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