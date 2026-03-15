"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { illustrations } from "@/data/illustrations";
import imageDimensions from "@/data/imageDimensions.json";
import GalleryLightbox from "@/components/shared/GalleryLightbox";
import MasonryGrid, { sortByAspect } from "@/components/shared/MasonryGrid";

function getConfig() {
  if (typeof window === "undefined") return { initial: 3, step: 3 };
  if (window.matchMedia("(max-width: 776px)").matches)  return { initial: 4, step: 3 };
  if (window.matchMedia("(max-width: 1024px)").matches) return { initial: 4, step: 2 };
  return { initial: 3, step: 3 };
}

const allSorted = sortByAspect(
  illustrations.map((imagePath) => ({
    key: imagePath,
    src: `/${imagePath}`,
    alt: "Illustration",
    dimensions: imageDimensions[imagePath] || { width: 700, height: 500 },
  }))
);

export default function IllustrationsWall() {
  const [config, setConfig] = useState(getConfig);
  const { initial, step } = config;
  const [visibleCount, setVisibleCount] = useState(initial);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");

  // ── Синхронізуємо visibleCount коли initial змінюється ──────────────────
  useEffect(() => {
    setVisibleCount(initial);
  }, [initial]);

  // ── Оновлюємо config при resize ──────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setConfig(getConfig());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── Slice the pre-sorted list ────────────────────────────────────────────
  const sortedItems = useMemo(
    () => allSorted.slice(0, visibleCount),
    [visibleCount]
  );

  const lightboxImages = useMemo(
    () => sortedItems.map((item) => item.key),
    [sortedItems]
  );

  const items = useMemo(
    () =>
      sortedItems.map((item, si) => ({
        ...item,
        alt: `Illustration ${si + 1}`,
        priority: si < 3,
        onClick: (e, idx) => {
          const previewSrc =
            e.currentTarget?.querySelector("img")?.currentSrc || "";
          setLightboxPreviewSrc(previewSrc);
          setLightboxIndex(idx);
        },
      })),
    [sortedItems]
  );

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxPreviewSrc("");
  };

  const getLightboxSrc = useCallback((imagePath) => `/${imagePath}`, []);
  const getLightboxDimensions = useCallback(
    (imagePath) => imageDimensions[imagePath],
    []
  );

  if (!items.length) return null;

  return (
    <section className="section overflow-x-hidden">
      <div className="container mx-auto">
        <h2 className="mb-10 section-title">Illustrations</h2>

        <MasonryGrid
          items={items}
          columns={{ default: 3, 1024: 2, 776: 1 }}
        />

        {visibleCount < illustrations.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + step, illustrations.length)
                )
              }
              className="btn mt-0"
            >
              Show more
            </button>
          </div>
        )}
      </div>

      <GalleryLightbox
        images={lightboxImages}
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