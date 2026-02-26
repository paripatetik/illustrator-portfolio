"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
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

const INITIAL_VISIBLE = 5;
const LOAD_MORE_STEP = 4;

export default function IllustrationsWall() {
  const illustrationList = useMemo(
    () => (Array.isArray(illustrations) ? illustrations : []),
    []
  );
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [columnCount, setColumnCount] = useState(1);
  const visibleIllustrations = useMemo(
    () => illustrationList.slice(0, visibleCount),
    [illustrationList, visibleCount]
  );
  const illustrationColumns = useMemo(() => {
    const columns = Array.from({ length: columnCount }, () => []);
    visibleIllustrations.forEach((imagePath, index) => {
      columns[index % columnCount].push({ imagePath, index });
    });
    return columns;
  }, [visibleIllustrations, columnCount]);

  const [loadedMap, setLoadedMap] = useState({});
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(3);
      } else if (window.innerWidth >= 776) {
        setColumnCount(2);
      } else {
        setColumnCount(1);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
      Math.min(prev + LOAD_MORE_STEP, illustrationList.length)
    );
  };

  const getLightboxSrc = useCallback((imagePath) => `/${imagePath}`, []);

  const getLightboxDimensions = useCallback(
    (imagePath) => imageDimensions[imagePath],
    []
  );

  if (!visibleIllustrations.length) return null;

  return (
    <section className="section bg-cream overflow-x-hidden">
      <div className="container mx-auto px-4 pt-2">
        <h2 className="mb-10 section-title">Illustrations</h2>

        <div className="grid grid-cols-1 gap-8 min-[776px]:grid-cols-2 lg:grid-cols-3">
          {illustrationColumns.map((column, colIndex) => (
            <div key={`illustration-column-${colIndex}`} className="flex flex-col gap-8">
              {column.map(({ imagePath, index }) => {
                const dimensions = imageDimensions[imagePath] || {
                  width: 700,
                  height: 500,
                };

                return (
                  <button
                    key={`${imagePath}-${index}`}
                    type="button"
                    onClick={(e) => {
                      const previewSrc =
                        e.currentTarget.querySelector("img")?.currentSrc || "";
                      openLightbox(index, previewSrc);
                    }}
                    className="group block w-full cursor-pointer text-left"
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
          ))}
        </div>

        {visibleCount < illustrationList.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="contact-submit mt-0"
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
