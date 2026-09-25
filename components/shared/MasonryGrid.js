"use client";

import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";

// ── Static placeholder ──────────────────────────────────────────────────────
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
 */
export function sortByAspect(items) {
  return [...items].sort((a, b) => {
    const ra = (a.dimensions?.height ?? 1) / (a.dimensions?.width ?? 1);
    const rb = (b.dimensions?.height ?? 1) / (b.dimensions?.width ?? 1);
    return ra - rb;
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CardOverlay({ overlay }) {
  return (
   <>
    <div className="card-overlay-gradient absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10 opacity-90 md:opacity-0 sm:group-hover:opacity-90" />
    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <h3 className="t-project-card drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] md:opacity-0 sm:group-hover:opacity-100">
        {overlay.title}
      </h3>
      {overlay.description && (
        <p className="t-body mt-1 md:mt-3 text-white/95 drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] md:opacity-0 sm:group-hover:opacity-100">
          {overlay.description}
        </p>
      )}
    </div>
  </>
  );
}

function GalleryCard({ children }) {
  return (
    <article className="overflow-hidden img-rounded bg-white p-[6px]">
      <div className="overflow-hidden rounded-[18px] bg-foreground/5">
        {children}
      </div>
    </article>
  );
}

function DefaultCard({ overlay, children }) {
  return (
    <article className="relative overflow-hidden rounded-[var(--radius-card)]">
      
        {children}
        {overlay && <CardOverlay overlay={overlay} />}
    
    </article>
  );
}

// ── MasonryGrid ──────────────────────────────────────────────────────────────
/**
 * Unified masonry grid that renders images with optional overlays, links, or
 * lightbox-click behaviour.
 *
 * Item shape:
 *   key               string                   unique identifier / React key
 *   src               string                   image src path
 *   alt               string                   image alt text
 *   dimensions        { width, height }        natural image dimensions
 *   href?             string                   → wraps card in <Link>
 *   onLinkClick?      () => void               onClick on the Link
 *   onClick?          (e, sortedIndex) => void → wraps card in <button>
 *   overlay?          { title, description? }  → hover gradient + text
 *   priority?         boolean                  → Image priority / eager
 *   variant?          'default' | 'gallery'    → gallery = white padded frame
 *   itemRef?          RefCallback              → ref on the outer wrapper div
 *   wrapperClassName? string                   → extra classes on wrapper div
 *   wrapperStyle?     CSSProperties            → extra styles on wrapper div
 */
export default function MasonryGrid({
  items = [],
  columns = { default: 3, 1024: 2, 776: 1 },
  gap = "gap-6",
  imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  imageStyle = { minHeight: "clamp(12rem, 20vw, 18rem)" },
  imageQuality = 85,
}) {
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
        const isGallery = variant === "gallery";

        // ── Image ──
        const imgNode = (
          <Image
            src={src}
            data-gallery-src={src}
            alt={alt}
            width={w}
            height={h}
            sizes={imageSizes}
            className="block"
            style={imageStyle}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            priority={priority}
            quality={imageQuality}
          />
        );

        // ── Card shell ──
        const card = isGallery
          ? <GalleryCard >{imgNode}</GalleryCard>
          : <DefaultCard overlay={overlay}>{imgNode}</DefaultCard>;

        // ── Interaction wrapper (Link / button / plain) ──
        const interactiveCard = href
          ? (
            <Link href={href} onClick={onLinkClick} className="block w-full">
              {card}
            </Link>
          )
          : onClick
          ? (
            <button
              type="button"
              onClick={(e) => onClick(e, index)}
              className="block w-full cursor-pointer text-left"
            >
              <span className="sr-only">{alt}</span>
              {card}
            </button>
          )
          : card;

        return (
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
