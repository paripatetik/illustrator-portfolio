"use client";

import { useCallback, useMemo, useState } from "react";
import { illustrations } from "@/data/illustrations";
import imageDimensions from "@/data/imageDimensions.json";
import GalleryLightbox from "@/components/shared/GalleryLightbox";
import MasonryGrid, { sortByAspect } from "@/components/shared/MasonryGrid";

const INITIAL_VISIBLE = 3;
const LOAD_MORE_STEP = 3;

// ── Sort the FULL array once at module level ─────────────────────────────────
// This guarantees stable positions: "Show more" only appends new items at the
// end of the already-sorted list — nothing already visible ever moves.
const allSorted = sortByAspect(
  illustrations.map((imagePath) => ({
    key: imagePath,
    src: `/${imagePath}`,
    alt: "Illustration",
    dimensions: imageDimensions[imagePath] || { width: 700, height: 500 },
    _path: imagePath,
  }))
);

export default function IllustrationsWall() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");

  // Slice the pre-sorted list — order never changes, items only get added
  const sortedItems = useMemo(() => allSorted.slice(0, visibleCount), [visibleCount]);

  // Sorted filenames forwarded to lightbox so in-lightbox navigation
  // matches the visual grid order.
  const lightboxImages = useMemo(
    () => sortedItems.map((item) => item._path),
    [sortedItems]
  );

  // Build final item list with click handlers keyed to sorted index
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

  const getLightboxSrc = useCallback(
    (imagePath) => `/${imagePath}`,
    []
  );
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
                  Math.min(prev + LOAD_MORE_STEP, illustrations.length)
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