"use client";

import { useCallback, useMemo, useState } from "react";
import { illustrations } from "@/data/illustrations";
import imageDimensions from "@/data/imageDimensions.json";
import GalleryLightbox from "@/components/shared/GalleryLightbox";
import MasonryGrid, { sortByAspect } from "@/components/shared/MasonryGrid";

const allSorted = sortByAspect(
  illustrations.map((imagePath) => ({
    key: imagePath,
    src: `/${imagePath}`,
    alt: "Illustration",
    dimensions: imageDimensions[imagePath] || { width: 700, height: 500 },
  }))
);

const lightboxImages = allSorted.map((item) => item.key);

export default function IllustrationsWall() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");


  const items = useMemo(
    () =>
      allSorted.map((item, si) => ({
        ...item,
        alt: `Illustration ${si + 1}`,
        onClick: (e, idx) => {
          const previewSrc =
            e.currentTarget?.querySelector("img")?.currentSrc || "";
          setLightboxPreviewSrc(previewSrc);
          setLightboxIndex(idx);
        },
      })),
    []
  );

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxPreviewSrc("");
  };

  const getLightboxSrc = useCallback((imagePath) => `/${imagePath}`, []);
  const getLightboxDimensions = useCallback((imagePath) => imageDimensions[imagePath], []);
  if (!items.length) return null;

  return (
    <section className="section overflow-x-hidden">
      <div className="container mx-auto">
        <h2 className="mb-10 section-title">Illustrations</h2>

        <MasonryGrid
          items={items}
          columns={{ default: 5, 1023: 3, 639: 1 }}
          gap="gap-3 sm:gap-4"
          imageSizes="(max-width: 639px) 100vw, (max-width: 1023px) 33vw, 20vw"
          imageStyle={{ width: "100%", height: "auto" }}
          imageQuality={75}
        />

      </div>

      {lightboxIndex !== null && (
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
      )}
    </section>
  );
}
