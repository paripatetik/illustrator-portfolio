"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import projects from "@/data/projects.json";

function getProjectCover(images = []) {
  return images.find((image) => image.includes("-cover")) || images[0];
}

// Check sessionStorage outside of component to avoid setState in effects
function getInitialAnimationState() {
  if (typeof window === "undefined") {
    return { shouldAnimate: true, isInView: true }; // TEMP: Force true for debugging
  }
  
  const hasAnimated = sessionStorage.getItem("projectsWallAnimated") === "true";
  
  if (hasAnimated) {
    // Already animated - show immediately without animation
    return { shouldAnimate: false, isInView: true };
  }
  
  // First visit - check if IntersectionObserver is supported
  const hasIntersectionObserver = "IntersectionObserver" in window;
  
  if (!hasIntersectionObserver) {
    // No observer support - show immediately without animation
    return { shouldAnimate: false, isInView: true };
  }
  
  // First visit with observer support - wait for intersection
  return { shouldAnimate: true, isInView: true }; // TEMP: Force true for debugging
}

export default function ProjectsWall() {
  const sectionRef = useRef(null);
  const [animationState, setAnimationState] = useState(getInitialAnimationState);
  const [isMobile, setIsMobile] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('ProjectsWall animation state:', animationState);
  }, [animationState]);

  // Set up IntersectionObserver
  useEffect(() => {
    if (animationState.isInView) return; // Already in view, don't observe again
    if (!sectionRef.current) return;
    if (typeof window === "undefined") return;

    console.log('Setting up IntersectionObserver');

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('IntersectionObserver triggered, isIntersecting:', entry.isIntersecting);
        if (entry.isIntersecting) {
          setAnimationState((prev) => ({ ...prev, isInView: true }));
          // Mark as animated in sessionStorage
          sessionStorage.setItem("projectsWallAnimated", "true");
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [animationState.isInView]);

  // Detect mobile for animation direction
  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section ref={sectionRef} className="section bg-cream">
      <div className="container mx-auto px-4">
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
            const desktopByColumn = [
              { x: -80, y: 0 }, // left column
              { x: 0, y: 70 },  // center column (from bottom)
              { x: 80, y: 0 },  // right column
            ];
            const mobilePattern = [
              { x: -70, y: 0 }, // left
              { x: 70, y: 0 },  // right
            ];
            
            const dir = isMobile
              ? mobilePattern[index % mobilePattern.length]
              : desktopByColumn[index % 3];

            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group"
              >
                <article
                  className="relative overflow-hidden rounded-[var(--radius-card)] bg-transparent transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:group-hover:-translate-y-3"
                  style={{
                    "--from-x": `${dir.x}px`,
                    "--from-y": `${dir.y}px`,
                    // Animate only if shouldAnimate is true AND isInView is true
                    animation: animationState.shouldAnimate && animationState.isInView
                      ? `wallSlideIn 0.95s cubic-bezier(0.2,0.8,0.2,1) ${index * 120}ms both`
                      : "none",
                    // Show immediately if not animating, or if animation is complete
                    opacity: animationState.isInView ? 1 : 0,
                    transform: animationState.isInView
                      ? "translate(0, 0)"
                      : `translate(${dir.x}px, ${dir.y}px)`,
                  }}
                >
                  <div className="relative w-full h-[260px] sm:h-[280px]">
                    <Image
                      src={coverSrc}
                      alt={`${project.title} cover`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/35 to-foreground/10 opacity-0 transition-opacity duration-500 group-hover:opacity-90"></div>

                    <div className="absolute inset-0 flex flex-col justify-end p-6 transition-transform duration-500 ease-out group-hover:-translate-y-2">
                      <h3 className="t-project text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] transition-all duration-500 ease-out translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        {project.title}
                      </h3>
                      <p className="t-body text-white/95 mt-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] transition-all duration-500 ease-out delay-75 translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
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
    </section>
  );
}