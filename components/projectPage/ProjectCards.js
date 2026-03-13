"use client";

import { useCallback, useMemo, useState } from "react";
import imageDimensions from "@/data/imageDimensions.json";
import GalleryLightbox from "@/components/shared/GalleryLightbox";
import MasonryGrid, { sortByAspect } from "@/components/shared/MasonryGrid";

function getHeroImage(images = []) {
  return images.find((img) => img.startsWith("01")) || images[0];
}

export default function ProjectCards({ images, folder, title }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");

  // ── Gallery = everything except the hero (01.webp) ───────────────────────
  const galleryImages = useMemo(() => {
    const hero = getHeroImage(images);
    return images.filter((img) => img !== hero);
  }, [images]);

  // ── Sort by aspect ratio, store sorted filenames for lightbox ────────────
  const { items, sortedFilenames } = useMemo(() => {
    const raw = galleryImages.map((image) => ({
      key: image,
      src: `/projects/${folder}/${image}`,
      alt: `${title} artwork`,
      dimensions:
        imageDimensions[`projects/${folder}/${image}`] || { width: 700, height: 500 },
      variant: "gallery",
    }));

    const sorted = sortByAspect(raw);
    const filenames = sorted.map((item) => item.key);

    const withHandlers = sorted.map((item, si) => ({
      ...item,
      alt: `${title} artwork ${si + 1}`,
      // Click opens lightbox at the sorted index — matches the sorted filenames
      // array passed to GalleryLightbox, so in-lightbox navigation is consistent.
      onClick: (e, idx) => {
        const previewSrc =
          e.currentTarget?.querySelector("img")?.currentSrc || "";
        setLightboxPreviewSrc(previewSrc);
        setLightboxIndex(idx);
      },
    
    }));

    return { items: withHandlers, sortedFilenames: filenames };
  }, [galleryImages, folder, title]);

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxPreviewSrc("");
  };

  const getLightboxSrc = useCallback(
    (filename) => `/projects/${folder}/${filename}`,
    [folder]
  );
  const getLightboxDimensions = useCallback(
    (filename) => imageDimensions[`projects/${folder}/${filename}`],
    [folder]
  );

  return (
    <section className="section pt-0">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center mb-8 text-center gap-3">
          <h2 className="section-title">Gallery</h2>
          <p className="t-body text-foreground/55">
            {galleryImages.length}{" "}
            {galleryImages.length === 1 ? "image" : "images"}
          </p>
        </div>

        <MasonryGrid
          items={items}
          columns={{ default: 2, 639: 1 }}
       
        />
      </div>

      <GalleryLightbox
        images={sortedFilenames}
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