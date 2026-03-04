"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import projects from "@/data/projects.json";

function ArrowLeftIcon({ className = "size-5 shrink-0" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M19 12H5m7-7-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "size-5 shrink-0" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 12h14m-7-7 7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProjectNav({ currentSlug }) {

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
           <Link
        href="/"
        className={`btn fixed right-4 z-50 mt-0 transition-all duration-400 top-4`}
      >

        Main
      </Link>

      <nav className="container mx-auto px-4 py-12 flex items-center justify-between gap-4">
        <Link
          href={`/projects/${prevProject.slug}`}
          className="btn relative mt-0 px-12 sm:px-14 text-center gap-0"
        >
          <ArrowLeftIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2" />
          <span className="block leading-tight">{prevProject.title}</span>
        </Link>

        <Link
          href={`/projects/${nextProject.slug}`}
          className="btn relative mt-0 px-12 sm:px-14 text-center gap-0"
        >
          <span className="block leading-tight">{nextProject.title}</span>
          <ArrowRightIcon className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2" />
        </Link>
      </nav>
    </>
  );
}
