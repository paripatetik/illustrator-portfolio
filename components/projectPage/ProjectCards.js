"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

function getHeroImage(images = []) {
  return images.find((image) => image.startsWith("01")) || images[0];
}

export default function ProjectCards({ images, folder, title }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const cardRefs = useRef([]);

  const galleryImages = useMemo(() => {
    const heroImage = getHeroImage(images);
    return images.filter((image) => image !== heroImage);
  }, [images]);

  const totalImages = galleryImages.length;
  const currentNumber =
    lightboxIndex !== null ? lightboxIndex + 1 : 1;

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
  };

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === 0 ? totalImages - 1 : prev - 1
    );
    setIsZoomed(false);
  };

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === totalImages - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (lightboxIndex === null) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, totalImages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      cardRefs.current.forEach((el) =>
        el?.setAttribute("data-visible", "true")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [galleryImages.length]);


  return (
    <section className="section pt-0">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center mb-8 text-center gap-3">
          <h2 className="t-section">Gallery</h2>
          <p className="text-sm text-foreground/55">
            {totalImages} images
          </p>
        </div>

        {/* Masonry layout using CSS columns - preserves natural aspect ratios */}
        <div
          id="project-gallery"
          className="flex flex-wrap gap-6 w-full justify-center"
        >
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setLightboxIndex(index)}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="group relative w-full sm:flex-[0_1_calc(50%-12px)] overflow-hidden img-rounded bg-white/85 p-[6px] text-left transition-transform duration-300 hover:-translate-y-1 mb-6 opacity-0 translate-y-4 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 data-[visible=true]:animate-[fadeInUp_0.8s_ease-out_var(--delay)_both] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:animate-none transition-opacity transition-transform"
              style={{ "--delay": `${index * 80}ms` }}
            >
              <span className="sr-only">
                Open image {index + 1} in lightbox
              </span>
              <span className="absolute inset-0 rounded-[22px] ring-1 ring-foreground/10 pointer-events-none" />
              <div className="relative w-full overflow-hidden rounded-[18px] bg-white">
                {/* Using regular img instead of Next Image for natural sizing */}
                <img
                  src={`/projects/${folder}/${image}`}
                  alt={`${title} artwork ${index + 2}`}
                  loading="lazy"
                  className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ display: 'block' }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 py-6 animate-[fadeIn_0.3s_ease-out] motion-reduce:animate-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery lightbox`}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Close lightbox"
          />
          <div className="relative z-[1] w-full max-w-6xl">
            <div className="flex items-center justify-between mb-4 text-white/80 text-sm">
              <span>
                {currentNumber} / {totalImages}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close lightbox"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[28px] animate-[fadeInUp_0.35s_ease-out] motion-reduce:animate-none">
              <div
                className={`relative w-full max-h-[80vh] overflow-hidden ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed((prev) => !prev)}
                onMouseMove={(event) => {
                  if (!isZoomed) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;
                  event.currentTarget.style.setProperty(
                    "--zoom-x",
                    `${x.toFixed(2)}%`
                  );
                  event.currentTarget.style.setProperty(
                    "--zoom-y",
                    `${y.toFixed(2)}%`
                  );
                }}
              >
                <img
                  src={`/projects/${folder}/${galleryImages[lightboxIndex]}`}
                  alt={`${title} detail ${lightboxIndex + 1}`}
                  className={`block w-full h-auto max-h-[80vh] object-contain transition-transform duration-300 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  style={{
                    transformOrigin: "var(--zoom-x, 50%) var(--zoom-y, 50%)",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={showPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all shadow-lg border border-white/20"
                aria-label="Previous image"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all shadow-lg border border-white/20"
                aria-label="Next image"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
