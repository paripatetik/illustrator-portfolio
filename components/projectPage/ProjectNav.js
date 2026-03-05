"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import projects from "@/data/projects.json";
import { markHomeScrollRestorePending } from "@/lib/homeScrollMemory";

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
    <section className="section pt-0 pb-7">
      <div className="container mx-auto px-4 max-w-7xl">
      <Link
        href="/"
        onClick={markHomeScrollRestorePending}
        className={`btn fixed right-4 z-50 mt-0 transition-all duration-200 ${
          isScrolled ? "top-1" : "top-4"
        }`}
      >
        Main
      </Link>

      <nav className="flex justify-between gap-2 text-base">
        <Link
          href={`/projects/${prevProject.slug}`}
          className="btn relative mt-0 h-[80px] sm:w-45 w-36 md:w-60 px-4 py-1 gap-0"
        >
          <ArrowLeftIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 sm:left-4 sm:size-7" />
          <span className="w-[75%]">{prevProject.title}</span>
           
      
        </Link>

        <Link
          href={`/projects/${nextProject.slug}`}
          className="btn relative mt-0 h-[80px] sm:w-45 w-36 md:w-60 px-4 py-1 gap-0"
        >
          <span className="w-[75%]">{nextProject.title}</span>
            
          
          <ArrowRightIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 sm:right-4 sm:size-7" />
        </Link>
      </nav>
      </div>
    </section>
  );
}
