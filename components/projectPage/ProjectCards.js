"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import imageDimensions from "@/data/imageDimensions.json";
import GalleryLightbox from "@/components/shared/GalleryLightbox";

function getHeroImage(images = []) {
  return images.find((image) => image.startsWith("01")) || images[0];
}

export default function ProjectCards({ images, folder, title }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");
  const [loadedMap, setLoadedMap] = useState({});

  const cardRefs = useRef([]);

  const galleryImages = useMemo(() => {
    const heroImage = getHeroImage(images);
    return images.filter((image) => image !== heroImage);
  }, [images]);

  const totalImages = galleryImages.length;

  const openLightbox = (index, previewSrc = "") => {
    if (index < 0 || index >= totalImages) return;
    setLightboxPreviewSrc(previewSrc);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxPreviewSrc("");
  };

  const getLightboxSrc = useCallback(
    (image) => `/projects/${folder}/${image}`,
    [folder]
  );

  const getLightboxDimensions = useCallback(
    (image) => imageDimensions[`projects/${folder}/${image}`],
    [folder]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      cardRefs.current.forEach((el) => el?.setAttribute("data-visible", "true"));
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
          <h2 className="section-title">Gallery</h2>
          <p className="text-sm text-foreground/55">
            {totalImages} {totalImages === 1 ? "image" : "images"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-5 w-full justify-center">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={(e) => {
                const previewSrc =
                  e.currentTarget.querySelector("img")?.currentSrc || "";
                openLightbox(index, previewSrc);
              }}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="group relative w-full sm:flex-[0_1_calc(50%-12px)] overflow-hidden img-rounded bg-white p-[6px] text-left transition-transform duration-300 hover:-translate-y-1 mb-4 sm:mb-5 opacity-0 translate-y-4 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 data-[visible=true]:animate-[fadeInUp_0.8s_ease-out_var(--delay)_both] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:animate-none cursor-pointer"
              style={{ "--delay": `${index * 80}ms` }}
            >
              <span className="sr-only">Open image {index + 1} in lightbox</span>
              <span className="absolute inset-0 rounded-[22px] ring-1 ring-foreground/10 pointer-events-none" />
              <div
                className="relative w-full aspect-[4/3] sm:aspect-[3/2] overflow-hidden rounded-[18px] bg-foreground/5"
                data-loaded={loadedMap[image] ? "true" : "false"}
              >
                <span
                  aria-hidden="true"
                  className="gallery-shimmer absolute inset-0 transition-opacity duration-700 data-[loaded=true]:opacity-0"
                />
                <Image
                  src={`/projects/${folder}/${image}`}
                  alt={`${title} artwork ${index + 2}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className={`block object-cover transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.012] transform-gpu will-change-transform ${
                    loadedMap[image]
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-[1.01] blur-[6px]"
                  }`}
                  loading="lazy"
                  fetchPriority="low"
                  quality={85}
                  onLoad={() => {
                    requestAnimationFrame(() => {
                      setLoadedMap((prev) => ({ ...prev, [image]: true }));
                    });
                  }}
                  onError={() => {
                    setLoadedMap((prev) => ({ ...prev, [image]: true }));
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <GalleryLightbox
        images={galleryImages}
        openIndex={lightboxIndex}
        previewSrc={lightboxPreviewSrc}
        onClose={closeLightbox}
        getImageSrc={getLightboxSrc}
        getImageDimensions={getLightboxDimensions}
        ariaLabel={`${title} gallery lightbox`}
        getImageAlt={(index) => `${title} detail ${index + 1}`}
      />
    </section>
  );
}
