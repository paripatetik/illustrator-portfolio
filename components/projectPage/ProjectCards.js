"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

function getHeroImage(images = []) {
  return images.find((image) => image.startsWith("01")) || images[0];
}

export default function ProjectCards({ images, folder, title }) {
  const [isOpen, setIsOpen] = useState(false);

  const galleryImages = useMemo(() => {
    const heroImage = getHeroImage(images);
    return images.filter((image) => image !== heroImage);
  }, [images]);

  const openHeight = Math.max(640, galleryImages.length * 620);
  const closedHeightClasses =
    "max-h-[420px] sm:max-h-[520px] lg:max-h-[620px]";

  return (
    <section className="section pt-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="t-section">Gallery</h2>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="project-gallery"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white shadow-[0_10px_24px_rgba(240,107,122,0.35)] transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="sr-only">
              {isOpen ? "Collapse gallery" : "Expand gallery"}
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`w-6 h-6 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div
          id="project-gallery"
          className={`relative transition-[max-height] duration-700 ease-out overflow-hidden ${closedHeightClasses}`}
          style={isOpen ? { maxHeight: `${openHeight}px` } : undefined}
        >
          <div className="flex flex-col gap-6">
            {galleryImages.map((image, index) => {
              const reverseDelay = (galleryImages.length - index - 1) * 60;
              const delay = isOpen ? index * 80 : reverseDelay;
              const closedOffset = index * 22;
              const closedScale = Math.max(0.96, 1 - index * 0.01);

              return (
                <article
                  key={image}
                  className="relative w-full max-w-4xl mx-auto"
                  style={{
                    transform: isOpen
                      ? "translateY(0) scale(1)"
                      : `translateY(${closedOffset}px) scale(${closedScale})`,
                    opacity: isOpen || index < 3 ? 1 : 0,
                    transition:
                      "transform 650ms cubic-bezier(0.2, 0.7, 0.3, 1), opacity 450ms ease",
                    transitionDelay: `${delay}ms`,
                    zIndex: galleryImages.length - index,
                  }}
                >
                  <div className="img-rounded bg-white/85 p-[6px]">
                    <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] overflow-hidden rounded-[18px]">
                      <Image
                        src={`/projects/${folder}/${image}`}
                        alt={`${title} artwork ${index + 2}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 70vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
