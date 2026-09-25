"use client";

import { useEffect, useMemo, useRef } from "react";
import projects from "@/data/projects.json";
import imageDimensions from "@/data/imageDimensions.json";
import { saveHomeScrollPosition } from "@/lib/homeScrollMemory";
import MasonryGrid, { sortByAspect } from "@/components/shared/MasonryGrid";

function getProjectCover(images = []) {
  return images.find((img) => img.includes("-cover")) || images[0];
}

export default function ProjectsWall() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const cards = sectionRef.current.querySelectorAll(".project-card");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("project-card-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px 60px 0px" });

    cards.forEach((card) => {
      card.classList.add("project-card-pending");
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
      cards.forEach((card) => {
        card.classList.remove("project-card-pending", "project-card-visible");
      });
    };
  }, []);

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

    return sorted.map((item, index) => ({
      ...item,
      priority: index < 2,
      wrapperClassName: "project-card [break-inside:avoid] [page-break-inside:avoid] [column-break-inside:avoid] align-top",
      wrapperStyle: {
        "--card-from-x": index % 2 === 0 ? "-80px" : "80px",
        "--card-delay": `${(index % 3) * 120}ms`,
      },
    }));
  }, []);

  return (
    <section ref={sectionRef} className="section bg-cream overflow-x-hidden">
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
