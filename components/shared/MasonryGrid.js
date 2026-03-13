"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Masonry from "react-masonry-css";

// ── Shimmer placeholder ──────────────────────────────────────────────────────
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f2efe9" offset="20%"/>
      <stop stop-color="#e8e2d9" offset="50%"/>
      <stop stop-color="#f2efe9" offset="70%"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f2efe9"/>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

// ── Sort utility ─────────────────────────────────────────────────────────────
/**
 * Sort items by ascending aspect ratio:
 * landscape / square images first, portrait / tall images last.
 *
 * Works on any array whose items have `dimensions: { width, height }`.
 */
export function sortByAspect(items) {
  return [...items].sort((a, b) => {
    const ra = (a.dimensions?.height ?? 1) / (a.dimensions?.width ?? 1);
    const rb = (b.dimensions?.height ?? 1) / (b.dimensions?.width ?? 1);
    return ra - rb;
  });
}

// ── MasonryGrid ──────────────────────────────────────────────────────────────
/**
 * Unified masonry grid that renders images with optional overlays, links, or
 * lightbox-click behaviour.
 *
 * Pass `items` already sorted (use `sortByAspect` in the consumer so the same
 * sorted order can be forwarded to GalleryLightbox).
 *
 * Item shape:
 *   key              string                   unique identifier / React key
 *   src              string                   image src path
 *   alt              string                   image alt text
 *   dimensions       { width, height }        natural image dimensions
 *   href?            string                   → wraps card in <Link>
 *   onLinkClick?     () => void               onClick on the Link
 *   onClick?         (e, sortedIndex) => void → wraps card in <button>
 *   overlay?         { title, description? }  → hover gradient + text
 *   priority?        boolean                  → Image priority / eager
 *   variant?         'default' | 'gallery'   → gallery = white padded frame
 *   itemRef?         RefCallback              → ref on the outer wrapper div
 *   wrapperClassName? string                  → extra classes on wrapper div
 *   wrapperStyle?    CSSProperties            → extra styles on wrapper div
 */
export default function MasonryGrid({
  items = [],
  columns = { default: 3, 1024: 2, 776: 1 },
  gap = "gap-6",
}) {
  const [loadedMap, setLoadedMap] = useState({});

  const markLoaded = (key) =>
    requestAnimationFrame(() =>
      setLoadedMap((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
    );

  return (
    <Masonry
      breakpointCols={columns}
      className={`flex ${gap}`}
      columnClassName={`flex flex-col ${gap}`}
    >
      {items.map((item, index) => {
        const {
          key,
          src,
          alt,
          dimensions,
          href,
          onLinkClick,
          onClick,
          overlay,
          priority = false,
          variant = "default",
          itemRef,
          wrapperClassName = "",
          wrapperStyle,
        } = item;

        const w = dimensions?.width || 700;
        const h = dimensions?.height || 500;
        const loaded = !!loadedMap[key];
        const isGallery = variant === "gallery";

        // ── Image ──
        const imgNode = (
          <Image
            src={src}
            alt={alt}
            width={w}
            height={h}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`h-auto w-full object-cover transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.015] transform-gpu will-change-transform ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.01]"
            }`}
            style={{ minHeight: "clamp(12rem, 20vw, 18rem)" }}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            priority={priority}
            quality={85}
            onLoad={() => markLoaded(key)}
            onError={() => markLoaded(key)}
          />
        );

        // ── Card shell ──
        const card = (
          <article
            className={
              isGallery
                ? "relative overflow-hidden img-rounded bg-white p-[6px]"
                : "relative overflow-hidden rounded-[var(--radius-card)]"
            }
          >
            {/* Gallery: thin ring overlay */}
            {isGallery && (
              <span className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-foreground/10" />
            )}

            <div
              className={
                isGallery
                  ? "relative w-full overflow-hidden rounded-[18px] bg-foreground/5"
                  : "relative w-full"
              }
            >
              {/* Gallery shimmer while loading */}
              {isGallery && (
                <span
                  aria-hidden="true"
                  className={`gallery-shimmer absolute inset-0 transition-opacity duration-700 ${
                    loaded ? "opacity-0" : ""
                  }`}
                />
              )}

              {imgNode}

              {/* Hover overlay (project cards) */}
              {overlay && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10 opacity-90 transition-opacity duration-700 ease-out sm:opacity-0 sm:group-hover:opacity-90" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="t-project-card text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                      {overlay.title}
                    </h3>
                    {overlay.description && (
                      <p className="t-body mt-3 text-white/95 drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] transition-all delay-75 duration-700 ease-out translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        {overlay.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </article>
        );

        // ── Interaction wrapper (Link / button / plain) ──
        let interactiveCard;
        if (href) {
          interactiveCard = (
            <Link href={href} onClick={onLinkClick} className="block w-full">
              {card}
            </Link>
          );
        } else if (onClick) {
          interactiveCard = (
            <button
              type="button"
              onClick={(e) => onClick(e, index)}
              className="block w-full cursor-pointer text-left"
            >
              <span className="sr-only">{alt}</span>
              {card}
            </button>
          );
        } else {
          interactiveCard = card;
        }

        return (
          // Outer div holds the ref (for IntersectionObserver / animation),
          // carries the `group` class so all hover variants work, and applies
          // any per-item wrapper classes / styles (e.g. wall-card animation).
          <div
            key={key}
            ref={itemRef}
            className={`group ${wrapperClassName}`}
            style={wrapperStyle}
          >
            {interactiveCard}
          </div>
        );
      })}
    </Masonry>
  );
}