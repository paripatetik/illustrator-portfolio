"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import imageDimensions from "@/data/imageDimensions.json";

function getHeroImage(images = []) {
  return images.find((image) => image.startsWith("01")) || images[0];
}

export default function ProjectCards({ images, folder, title }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [loadedMap, setLoadedMap] = useState({});
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const [lightboxPreviewSrc, setLightboxPreviewSrc] = useState("");
  const [lightboxShowLoader, setLightboxShowLoader] = useState(false);
  const [lightboxBox, setLightboxBox] = useState(null);
  
  const cardRefs = useRef([]);
  const zoomFrameRef = useRef(null);
  const dragStartRef = useRef(null);
  const lastTapRef = useRef(0);
  const preloadedLightboxRef = useRef(new Set());
  const loadingLightboxRef = useRef(new Set());
  const loaderTimeoutRef = useRef(null);
  const currentLightboxNameRef = useRef(null);
  const showPrevRef = useRef(null);
  const showNextRef = useRef(null);

  const galleryImages = useMemo(() => {
    const heroImage = getHeroImage(images);
    return images.filter((image) => image !== heroImage);
  }, [images]);

  const totalImages = galleryImages.length;
  const currentNumber = lightboxIndex !== null ? lightboxIndex + 1 : 1;
  const lightboxSrc =
    lightboxIndex !== null
      ? `/projects/${folder}/${galleryImages[lightboxIndex]}`
      : "";
  const lightboxImageName =
    lightboxIndex !== null ? galleryImages[lightboxIndex] : null;
  const lightboxDimensionKey = lightboxImageName
    ? `projects/${folder}/${lightboxImageName}`
    : null;
  const lightboxDimensions = lightboxDimensionKey
    ? imageDimensions[lightboxDimensionKey]
    : null;
  const lightboxWidth = lightboxDimensions?.width || 1600;
  const lightboxHeight = lightboxDimensions?.height || 1066;

  const getLightboxDimensions = useCallback(
    (imageName) => {
      if (!imageName) return { width: 1600, height: 1066 };
      const dimensionKey = `projects/${folder}/${imageName}`;
      const dims = imageDimensions[dimensionKey];
      if (dims?.width && dims?.height) return dims;
      return { width: 1600, height: 1066 };
    },
    [folder]
  );

  const computeLightboxBox = useCallback(
    (dims) => {
      if (typeof window === "undefined") return null;
      const ratio = dims.width / dims.height;
      const viewportWidth = window.visualViewport?.width || window.innerWidth;
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const maxWidth = viewportWidth * 0.92;
      const maxHeight = viewportHeight * (isMobile ? 0.7 : 0.82);
      let width = Math.min(maxWidth, maxHeight * ratio);
      let height = width / ratio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }
      return {
        width: Math.round(width),
        height: Math.round(height),
      };
    },
    [isMobile]
  );

  const updateLightboxBox = useCallback(
    (imageName) => {
      const dims = getLightboxDimensions(imageName);
      const nextBox = computeLightboxBox(dims);
      if (nextBox) setLightboxBox(nextBox);
    },
    [computeLightboxBox, getLightboxDimensions]
  );

  const preloadLightboxImage = useCallback(
    (imageName) => {
      if (!imageName || typeof window === "undefined") return;
      const src = `/projects/${folder}/${imageName}`;
      if (preloadedLightboxRef.current.has(src)) return;
      if (loadingLightboxRef.current.has(src)) return;
      loadingLightboxRef.current.add(src);
      const preload = new window.Image();
      preload.onload = () => {
        loadingLightboxRef.current.delete(src);
        preloadedLightboxRef.current.add(src);
      };
      preload.onerror = () => {
        loadingLightboxRef.current.delete(src);
      };
      preload.src = src;
    },
    [folder]
  );

  const openLightbox = (index, previewSrc = "") => {
    const imageName = galleryImages[index];
    const src = `/projects/${folder}/${imageName}`;
    preloadLightboxImage(imageName);
    const isPreloaded = preloadedLightboxRef.current.has(src);
    setLightboxPreviewSrc(previewSrc);
    setLightboxLoaded(isPreloaded);
    setLightboxShowLoader(!isPreloaded);
    currentLightboxNameRef.current = imageName;
    updateLightboxBox(imageName);
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setIsDragging(false);
    setHasDragged(false);
    setLightboxPreviewSrc("");
    setLightboxLoaded(false);
    setLightboxShowLoader(false);
    setLightboxBox(null);
    if (loaderTimeoutRef.current) {
      clearTimeout(loaderTimeoutRef.current);
      loaderTimeoutRef.current = null;
    }
  }, []);

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    const prevIndex = lightboxIndex === 0 ? totalImages - 1 : lightboxIndex - 1;
    const imageName = galleryImages[prevIndex];
    const src = `/projects/${folder}/${imageName}`;
    const isPreloaded = preloadedLightboxRef.current.has(src);
    setLightboxPreviewSrc("");
    setLightboxLoaded(isPreloaded);
    setLightboxShowLoader(!isPreloaded);
    currentLightboxNameRef.current = imageName;
    updateLightboxBox(imageName);
    setLightboxIndex(prevIndex);
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setHasDragged(false);
  };

  const showNext = (e) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIndex = lightboxIndex === totalImages - 1 ? 0 : lightboxIndex + 1;
    const imageName = galleryImages[nextIndex];
    const src = `/projects/${folder}/${imageName}`;
    const isPreloaded = preloadedLightboxRef.current.has(src);
    setLightboxPreviewSrc("");
    setLightboxLoaded(isPreloaded);
    setLightboxShowLoader(!isPreloaded);
    currentLightboxNameRef.current = imageName;
    updateLightboxBox(imageName);
    setLightboxIndex(nextIndex);
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setHasDragged(false);
  };

  useEffect(() => {
    showPrevRef.current = showPrev;
    showNextRef.current = showNext;
  });

  useEffect(() => {
    if (lightboxIndex === null || !lightboxLoaded) return;

    const next = galleryImages[(lightboxIndex + 1) % totalImages];
    const prev = galleryImages[(lightboxIndex - 1 + totalImages) % totalImages];

    [next, prev].forEach((img) => {
      if (!img) return;
      preloadLightboxImage(img);
    });
  }, [
    lightboxIndex,
    lightboxLoaded,
    galleryImages,
    totalImages,
    preloadLightboxImage,
  ]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleResize = () => {
      const imageName = currentLightboxNameRef.current;
      if (imageName) updateLightboxBox(imageName);
    };
    window.addEventListener("resize", handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, [galleryImages, lightboxIndex, updateLightboxBox]);

  // Prime first images on mobile to reduce first-open delay.
  useEffect(() => {
    const imagesToPrime = isMobile
      ? galleryImages.slice(0, 4)
      : galleryImages.slice(0, 1);
    imagesToPrime.forEach((img) => preloadLightboxImage(img));
  }, [galleryImages, isMobile, preloadLightboxImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (event) => {
      if (lightboxIndex === null) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevRef.current?.();
      if (event.key === "ArrowRight") showNextRef.current?.();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox]);

  // Detect mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Intersection observer for cards
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

  // Handle click to zoom (desktop)
  const handleImageClick = (e) => {
    if (isMobile) return; // Mobile uses double tap

    if (!zoomFrameRef.current) return;
    const rect = zoomFrameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    if (!isZoomed) {
      setZoomOrigin({ 
        x: Math.max(0, Math.min(100, x)), 
        y: Math.max(0, Math.min(100, y)) 
      });
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Handle double tap to zoom (mobile)
  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      e.preventDefault();
      
      const touch = e.changedTouches[0];
      const rect = zoomFrameRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      if (!isZoomed) {
        setZoomOrigin({ 
          x: Math.max(0, Math.min(100, x)), 
          y: Math.max(0, Math.min(100, y)) 
        });
        setIsZoomed(true);
      } else {
        setIsZoomed(false);
        setDragOffset({ x: 0, y: 0 });
      }
      
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // Touch pan when zoomed (mobile)
  const handleTouchStart = (e) => {
    if (!isZoomed || !isMobile) return;
    dragStartRef.current = {
      x: e.touches[0].clientX - dragOffset.x,
      y: e.touches[0].clientY - dragOffset.y,
    };
  };

  const handleTouchMove = (e) => {
    if (!isZoomed || !dragStartRef.current || !isMobile) return;
    e.preventDefault();
    
    const newX = e.touches[0].clientX - dragStartRef.current.x;
    const newY = e.touches[0].clientY - dragStartRef.current.y;
    
    const maxDrag = 150;
    setDragOffset({
      x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
      y: Math.max(-maxDrag, Math.min(maxDrag, newY)),
    });
  };

  // Clean up pointer capture
  useEffect(() => {
    if (!isZoomed) return;
    
    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };
    
    window.addEventListener("pointerup", handleGlobalPointerUp);
    
    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isZoomed]);

  return (
    <section className="section pt-0">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center mb-8 text-center gap-3">
          <h2 className="t-section">Gallery</h2>
          <p className="text-sm text-foreground/55">
            {totalImages} {totalImages === 1 ? 'image' : 'images'}
          </p>
        </div>

        {/* Gallery Grid */}
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
              className="group relative w-full sm:flex-[0_1_calc(50%-12px)] overflow-hidden img-rounded bg-white/85 p-[6px] text-left transition-transform duration-300 hover:-translate-y-1 mb-4 sm:mb-5 opacity-0 translate-y-4 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 data-[visible=true]:animate-[fadeInUp_0.8s_ease-out_var(--delay)_both] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:animate-none cursor-pointer"
              style={{ "--delay": `${index * 80}ms` }}
            >
              <span className="sr-only">
                Open image {index + 1} in lightbox
              </span>
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 md:backdrop-blur-sm animate-none md:animate-[fadeIn_0.2s_ease-out] motion-reduce:animate-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery lightbox`}
        >
          {lightboxShowLoader && (
            <div className="lightbox-loading-overlay" aria-hidden="true">
              <span className="lightbox-loading-spinner" />
            </div>
          )}
          {/* Background close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute inset-0"
            aria-label="Close lightbox"
            tabIndex={-1}
          />
          
          {/* Content container */}
          <div className="relative z-[1] flex min-h-[100dvh] w-full items-center justify-center px-3 py-6">
            <div className="relative inline-block max-w-full">
              {/* Top info just above the image */}
              <div className="mb-2 flex items-center justify-between">
                <span className="min-w-[4ch] rounded-full bg-black/35 px-2 py-1 text-xs font-medium text-white/80 backdrop-blur-sm tabular-nums">
                  {currentNumber} / {totalImages}
                </span>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-black/35 px-2 py-1 text-[11px] text-white/65 backdrop-blur-sm md:hidden">
                    Double tap to zoom
                  </span>
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="w-9 h-9 rounded-full bg-black/35 hover:bg-black/45 active:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                    aria-label="Close lightbox"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                ref={zoomFrameRef}
                className={`relative overflow-hidden rounded-[28px] ring-1 ring-white/10 transition-shadow duration-300 select-none inline-block ${
                  isZoomed
                    ? isDragging
                      ? "cursor-grabbing shadow-2xl"
                      : "cursor-grab shadow-2xl"
                    : "cursor-zoom-in shadow-xl"
                }`}
                style={{
                  width: lightboxBox?.width,
                  height: lightboxBox?.height,
                  touchAction: isZoomed ? "none" : "auto",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  maxWidth: "92vw",
                  maxHeight: isMobile ? "70svh" : "82vh",
                }}
                onPointerDown={!isMobile ? (e) => {
                  if (isZoomed) {
                    // Only start drag tracking when already zoomed
                    e.preventDefault();
                    setIsDragging(true);
                    setHasDragged(false);
                    dragStartRef.current = {
                      x: e.clientX - dragOffset.x,
                      y: e.clientY - dragOffset.y,
                      startX: e.clientX,
                      startY: e.clientY,
                    };
                  }
                } : undefined}
                onPointerMove={!isMobile ? (e) => {
                  if (!isDragging || !dragStartRef.current) return;
                  e.preventDefault();

                  const movedDistance = Math.hypot(
                    e.clientX - dragStartRef.current.startX,
                    e.clientY - dragStartRef.current.startY
                  );

                  if (movedDistance > 5) {
                    setHasDragged(true);
                  }

                  const newX = e.clientX - dragStartRef.current.x;
                  const newY = e.clientY - dragStartRef.current.y;

                  const maxDrag = 250;
                  setDragOffset({
                    x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
                    y: Math.max(-maxDrag, Math.min(maxDrag, newY)),
                  });
                } : undefined}
                onPointerUp={!isMobile ? (e) => {
                  // If we were dragging and actually moved, don't zoom
                  if (hasDragged) {
                    setHasDragged(false);
                    setIsDragging(false);
                    dragStartRef.current = null;
                    return;
                  }

                  // Otherwise it's a click - toggle zoom
                  setIsDragging(false);
                  dragStartRef.current = null;
                  handleImageClick(e);
                } : undefined}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-[24px] gallery-lightbox-frame"
                  data-loaded={lightboxLoaded ? "true" : "false"}
                >
                  <span
                    aria-hidden="true"
                    className="gallery-shimmer absolute inset-0 rounded-[24px] transition-opacity duration-700 data-[loaded=true]:opacity-0"
                  />
                  {!lightboxLoaded && (
                    <span className="gallery-loading" aria-hidden="true">
                      <span className="gallery-loading-ring" />
                    </span>
                  )}
                  {!lightboxLoaded && lightboxPreviewSrc && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={lightboxPreviewSrc}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 h-full w-full object-contain rounded-[24px]"
                      decoding="async"
                      draggable={false}
                    />
                  )}
                  <Image
                    src={lightboxSrc}
                    alt={`${title} detail ${lightboxIndex + 1}`}
                    width={lightboxWidth}
                    height={lightboxHeight}
                    sizes="(max-width: 768px) 92vw, 82vw"
                    quality={isMobile ? 70 : 82}
                    priority
                    className={`block h-full w-full object-contain rounded-[24px] transition-[transform,opacity,filter] ${
                      isMobile ? "duration-120" : "duration-280"
                    } ease-out ${
                      lightboxLoaded
                        ? "opacity-100 scale-100 blur-0"
                        : isMobile
                          ? "opacity-0 scale-[1.005] blur-0"
                          : "opacity-0 scale-[1.01] blur-[4px]"
                    }`}
                    decoding="sync"
                    style={{
                      transform: isZoomed
                        ? `scale(2) translate(${dragOffset.x / 2}px, ${dragOffset.y / 2}px)`
                        : "scale(1)",
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }}
                    onLoad={() => {
                      preloadedLightboxRef.current.add(lightboxSrc);
                      requestAnimationFrame(() => {
                        setLightboxLoaded(true);
                      });
                      if (loaderTimeoutRef.current) {
                        clearTimeout(loaderTimeoutRef.current);
                      }
                      loaderTimeoutRef.current = setTimeout(() => {
                        setLightboxShowLoader(false);
                        loaderTimeoutRef.current = null;
                      }, 120);
                    }}
                    onError={() => {
                      setLightboxLoaded(true);
                      setLightboxShowLoader(false);
                      if (loaderTimeoutRef.current) {
                        clearTimeout(loaderTimeoutRef.current);
                        loaderTimeoutRef.current = null;
                      }
                    }}
                    draggable={false}
                  />
                </div>

                {/* Zoom indicator */}
                {isZoomed && (
                  <div className="absolute bottom-4 right-4 px-3 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                      <path d="M11 8v6M8 11h6" />
                    </svg>
                    <span>Drag to pan • Click to zoom out</span>
                  </div>
                )}

              </div>

              {/* Controls just below the image */}
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={showPrev}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/35 hover:bg-black/45 active:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all shadow-lg border border-white/10"
                  aria-label="Previous image"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/35 hover:bg-black/45 active:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all shadow-lg border border-white/10"
                  aria-label="Next image"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
