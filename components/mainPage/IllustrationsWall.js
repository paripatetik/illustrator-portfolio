"use client";

import Image from "next/image";
import {
  useCallback,
  useState,
} from "react";
import { illustrations } from "@/data/illustrations";
import imageDimensions from "@/data/imageDimensions.json";
import GalleryLightbox from "@/components/shared/GalleryLightbox";
import Masonry from "react-masonry-css"

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

const INITIAL_VISIBLE = 3;
const LOAD_MORE_STEP = 3;

export default function IllustrationsWall() {
 
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visibleIllustrations = illustrations.slice(0, visibleCount)

  const [loadedMap, setLoadedMap] = useState({});
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");

  const openLightbox = (index, previewSrc = "") => {
    if (index < 0 || index >= visibleIllustrations.length) return;
    setLightboxPreviewSrc(previewSrc);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxPreviewSrc("");
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_STEP, illustrations.length)
    );
  };

  const getLightboxSrc = useCallback((imagePath) => `/${imagePath}`, []);

  const getLightboxDimensions = useCallback(
    (imagePath) => imageDimensions[imagePath],
    []
  );

  if (!visibleIllustrations.length) return null;

  return (
    <section className="section overflow-x-hidden">
      <div className="container mx-auto">
        <h2 className="mb-10 section-title">Illustrations</h2>


<Masonry
  breakpointCols={{
    default: 3,
    1024: 2,
    776: 1,
  }}
  className="flex gap-6"
  columnClassName="flex flex-col gap-6"
>
   {visibleIllustrations.map((imagePath, index) => {
            const dimensions = imageDimensions[imagePath] || {
              width: 700,
              height: 500,
            };

            return (
              <button
                key={`${imagePath}-${index}`}
                type="button"
                onClick={(e) => {
                  const previewSrc = e.currentTarget.querySelector("img")?.currentSrc || "";
                  openLightbox(index, previewSrc);
                }}
                className="group block w-full cursor-pointer"
              >
                <span className="sr-only">Open illustration {index + 1} in lightbox</span>
                <article className="relative overflow-hidden rounded-[var(--radius-card)] bg-transparent">
                  <div className="relative">
                    <Image
                      src={`/${imagePath}`}
                      alt={`Illustration ${index + 1}`}
                      width={dimensions.width}
                      height={dimensions.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`h-auto w-full object-cover transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.015] ${
                        loadedMap[imagePath]
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-[1.01]"
                      }`}
                      style={{
                        minHeight: "clamp(15rem, 24vw, 19rem)",
                      }}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(dimensions.width, dimensions.height)
                      )}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      fetchPriority={index < 3 ? "high" : "auto"}
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
</Masonry>

        {visibleCount < illustrations.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="btn mt-0"
            >
              Show more
            </button>
          </div>
        )}
      </div>

      <GalleryLightbox
        images={visibleIllustrations}
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
