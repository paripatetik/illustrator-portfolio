"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { illustrations } from "@/data/illustrations";
import imageDimensions from "@/data/imageDimensions.json";
import GalleryLightbox from "@/components/shared/GalleryLightbox";

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

export default function IllustrationsWall() {
  const illustrationList = useMemo(
    () => (Array.isArray(illustrations) ? illustrations : []),
    []
  );

  const [isMobile, setIsMobile] = useState(false);
  const [loadedMap, setLoadedMap] = useState({});
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");

  const cardRefs = useRef([]);
  const hasAnimatedRef = useRef(false);
  const skipAnimationRef = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__illustrationsWallAnimated !== true) return;

    skipAnimationRef.current = true;
    const cards = cardRefs.current.filter(Boolean);
    cards.forEach((card) => {
      card.classList.add("wall-static");
      card.classList.remove("wall-animate");
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skipAnimationRef.current) return;

    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const alreadyAnimated = window.__illustrationsWallAnimated === true;
    if (alreadyAnimated) {
      cards.forEach((card) => {
        card.classList.add("wall-static");
        card.classList.remove("wall-animate");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      requestAnimationFrame(() => {
        cards.forEach((card) => card.classList.add("wall-animate"));
      });
      window.__illustrationsWallAnimated = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wall-animate");
            if (!hasAnimatedRef.current) {
              hasAnimatedRef.current = true;
              window.__illustrationsWallAnimated = true;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const openLightbox = (index, previewSrc = "") => {
    if (index < 0 || index >= illustrationList.length) return;
    setLightboxPreviewSrc(previewSrc);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxPreviewSrc("");
  };

  const getLightboxSrc = useCallback((imagePath) => `/${imagePath}`, []);

  const getLightboxDimensions = useCallback(
    (imagePath) => imageDimensions[imagePath],
    []
  );

  if (!illustrationList.length) return null;

  return (
    <section className="section bg-cream overflow-x-hidden">
      <div className="container mx-auto px-4 pt-2">
        <h2 className="mb-10 section-title">Illustrations</h2>

        <div className="columns-1 [column-gap:2rem] min-[776px]:columns-2 lg:columns-3">
          {illustrationList.map((imagePath, index) => {
            const dimensions = imageDimensions[imagePath] || {
              width: 700,
              height: 500,
            };

            const desktopAlternate = [
              { x: -80, y: 0 },
              { x: 80, y: 0 },
            ];
            const mobilePattern = [
              { x: 0, y: 24 },
            ];

            const dir = isMobile
              ? mobilePattern[index % mobilePattern.length]
              : desktopAlternate[index % desktopAlternate.length];

            return (
              <button
                key={`${imagePath}-${index}`}
                type="button"
                onClick={(e) => {
                  const previewSrc =
                    e.currentTarget.querySelector("img")?.currentSrc || "";
                  openLightbox(index, previewSrc);
                }}
                className="group block w-full cursor-pointer mb-8 [break-inside:avoid] [page-break-inside:avoid] [column-break-inside:avoid] align-top text-left"
              >
                <span className="sr-only">Open illustration {index + 1} in lightbox</span>
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
                  <div className="relative">
                    <Image
                      src={`/${imagePath}`}
                      alt={`Illustration ${index + 1}`}
                      width={dimensions.width}
                      height={dimensions.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`h-auto w-full object-cover transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.015] transform-gpu will-change-transform ${
                        loadedMap[imagePath]
                          ? "opacity-100 scale-100 blur-0"
                          : "opacity-0 scale-[1.01] blur-[5px]"
                      }`}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(dimensions.width, dimensions.height)
                      )}`}
                      priority={index < 2}
                      quality={85}
                      onLoad={() => {
                        requestAnimationFrame(() => {
                          setLoadedMap((prev) => ({ ...prev, [imagePath]: true }));
                        });
                      }}
                      onError={() => {
                        setLoadedMap((prev) => ({ ...prev, [imagePath]: true }));
                      }}
                    />
                  </div>
                </article>
              </button>
            );
          })}
        </div>
      </div>

      <GalleryLightbox
        images={illustrationList}
        openIndex={lightboxIndex}
        previewSrc={lightboxPreviewSrc}
        onClose={closeLightbox}
        getImageSrc={getLightboxSrc}
        getImageDimensions={getLightboxDimensions}
        ariaLabel="Illustrations lightbox"
        getImageAlt={(index) => `Illustration detail ${index + 1}`}
      />
    </section>
  );
}
