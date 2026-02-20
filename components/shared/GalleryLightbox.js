"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function GalleryLightbox({
  images,
  openIndex,
  previewSrc = "",
  onClose,
  getImageSrc,
  getImageDimensions,
  ariaLabel = "Gallery lightbox",
  getImageAlt = (index) => `Image detail ${index + 1}`,
}) {
  const totalImages = Array.isArray(images) ? images.length : 0;
  const hasValidOpenIndex =
    typeof openIndex === "number" && openIndex >= 0 && openIndex < totalImages;
  const isOpen = hasValidOpenIndex;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const [currentPreviewSrc, setCurrentPreviewSrc] = useState("");

  const zoomFrameRef = useRef(null);
  const lightboxImgRef = useRef(null);
  const dragStartRef = useRef(null);
  const lastTapRef = useRef(0);
  const preloadedLightboxRef = useRef(new Set());
  const loadingLightboxRef = useRef(new Set());
  const showPrevRef = useRef(null);
  const showNextRef = useRef(null);

  const currentImage = isOpen ? images[currentIndex] : null;
  const lightboxSrc = currentImage ? getImageSrc(currentImage) : "";
  const currentNumber = currentIndex + 1;
  const frameWidth = isMobile ? "92vw" : "min(86vw, 1320px)";
  const frameHeight = isMobile ? "calc(100svh - 185px)" : "calc(100svh - 155px)";

  const preloadLightboxImage = useCallback(
    (image) => {
      if (!image || typeof window === "undefined") return;
      const src = getImageSrc(image);
      if (!src) return;
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
    [getImageSrc]
  );

  const resetInteractionState = useCallback(() => {
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setIsDragging(false);
    setHasDragged(false);
  }, []);

  const closeLightbox = useCallback(() => {
    resetInteractionState();
    setCurrentPreviewSrc("");
    setLightboxLoaded(false);
    onClose?.();
  }, [onClose, resetInteractionState]);

  const getRenderedImageRect = useCallback(() => {
    const imgEl = lightboxImgRef.current;
    if (!imgEl) return null;

    const rect = imgEl.getBoundingClientRect();
    const naturalWidth = imgEl.naturalWidth || 0;
    const naturalHeight = imgEl.naturalHeight || 0;

    if (!naturalWidth || !naturalHeight || !rect.width || !rect.height) {
      return rect;
    }

    const boxAspect = rect.width / rect.height;
    const imageAspect = naturalWidth / naturalHeight;

    let renderWidth = rect.width;
    let renderHeight = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspect > boxAspect) {
      renderHeight = rect.width / imageAspect;
      offsetY = (rect.height - renderHeight) / 2;
    } else {
      renderWidth = rect.height * imageAspect;
      offsetX = (rect.width - renderWidth) / 2;
    }

    return {
      left: rect.left + offsetX,
      right: rect.left + offsetX + renderWidth,
      top: rect.top + offsetY,
      bottom: rect.top + offsetY + renderHeight,
    };
  }, []);

  const isPointOnRenderedImage = useCallback(
    (clientX, clientY) => {
      const rect = getRenderedImageRect();
      if (!rect) return false;
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    },
    [getRenderedImageRect]
  );

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    if (!isOpen || totalImages < 2) return;

    const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    const image = images[prevIndex];

    // Keep the current image visible until the next one fades in.
    setCurrentPreviewSrc(lightboxSrc || "");
    setLightboxLoaded(false);

    if (totalImages > 1) {
      const next = images[(prevIndex + 1) % totalImages];
      const prev = images[(prevIndex - 1 + totalImages) % totalImages];
      preloadLightboxImage(next);
      preloadLightboxImage(prev);
    }

    setCurrentIndex(prevIndex);
    resetInteractionState();
  };

  const showNext = (e) => {
    if (e) e.stopPropagation();
    if (!isOpen || totalImages < 2) return;

    const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
    const image = images[nextIndex];

    // Keep the current image visible until the next one fades in.
    setCurrentPreviewSrc(lightboxSrc || "");
    setLightboxLoaded(false);

    if (totalImages > 1) {
      const next = images[(nextIndex + 1) % totalImages];
      const prev = images[(nextIndex - 1 + totalImages) % totalImages];
      preloadLightboxImage(next);
      preloadLightboxImage(prev);
    }

    setCurrentIndex(nextIndex);
    resetInteractionState();
  };

  useEffect(() => {
    showPrevRef.current = showPrev;
    showNextRef.current = showNext;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(openIndex);

    const image = images[openIndex];
    preloadLightboxImage(image);

    const src = getImageSrc(image);
    const isPreloaded = preloadedLightboxRef.current.has(src);

    setCurrentPreviewSrc("");
    setLightboxLoaded(isPreloaded);

    if (totalImages > 1) {
      const next = images[(openIndex + 1) % totalImages];
      const prev = images[(openIndex - 1 + totalImages) % totalImages];
      preloadLightboxImage(next);
      preloadLightboxImage(prev);
    }

    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setIsDragging(false);
    setHasDragged(false);
  }, [
    isOpen,
    openIndex,
    images,
    totalImages,
    getImageSrc,
    preloadLightboxImage,
  ]);

  useEffect(() => {
    if (!isOpen || !lightboxLoaded || totalImages < 2) return;

    const next = images[(currentIndex + 1) % totalImages];
    const prev = images[(currentIndex - 1 + totalImages) % totalImages];

    [next, prev].forEach((img) => {
      if (!img) return;
      preloadLightboxImage(img);
    });
  }, [isOpen, lightboxLoaded, currentIndex, totalImages, images, preloadLightboxImage]);

  useEffect(() => {
    const imagesToPrime = isMobile ? images.slice(0, 4) : images.slice(0, 1);
    imagesToPrime.forEach((img) => preloadLightboxImage(img));
  }, [images, isMobile, preloadLightboxImage]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevRef.current?.();
      if (event.key === "ArrowRight") showNextRef.current?.();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, closeLightbox]);

  useEffect(() => {
    if (!isZoomed) return;

    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => window.removeEventListener("pointerup", handleGlobalPointerUp);
  }, [isZoomed]);

  const handleImageClick = (e) => {
    if (isMobile) return;

    if (!isPointOnRenderedImage(e.clientX, e.clientY)) {
      closeLightbox();
      return;
    }

    const frame = zoomFrameRef.current;
    if (!frame) return;

    const frameRect = frame.getBoundingClientRect();
    const x = ((e.clientX - frameRect.left) / frameRect.width) * 100;
    const y = ((e.clientY - frameRect.top) / frameRect.height) * 100;

    if (!isZoomed) {
      setZoomOrigin({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    if (!isPointOnRenderedImage(touch.clientX, touch.clientY)) {
      closeLightbox();
      lastTapRef.current = 0;
      return;
    }

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      e.preventDefault();

      const frameRect = zoomFrameRef.current?.getBoundingClientRect();
      if (!frameRect) return;

      const x = ((touch.clientX - frameRect.left) / frameRect.width) * 100;
      const y = ((touch.clientY - frameRect.top) / frameRect.height) * 100;

      if (!isZoomed) {
        setZoomOrigin({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
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

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/90 md:backdrop-blur-sm animate-none md:animate-[fadeIn_0.2s_ease-out] motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {!lightboxLoaded && !currentPreviewSrc && (
        <div
          className="lightbox-loading-overlay"
          data-visible="true"
          aria-hidden="true"
        >
          <span className="lightbox-loading-spinner" />
        </div>
      )}

      <button
        type="button"
        onClick={closeLightbox}
        className="absolute inset-0"
        aria-label="Close lightbox"
        tabIndex={-1}
      />

      <div
        className="relative z-[1] flex min-h-[100dvh] w-full items-center justify-center px-3 py-6"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            closeLightbox();
          }
        }}
      >
        <div className="relative inline-block max-w-full">
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
                className="w-9 h-9 rounded-full bg-[color:var(--surface-rose)] hover:bg-[color:var(--accent)] active:bg-[color:var(--accent)] text-white border border-white/35 flex items-center justify-center transition-colors backdrop-blur-sm"
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
            className={`relative overflow-hidden select-none inline-block ${
              isZoomed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
            }`}
            style={{
              width: frameWidth,
              height: frameHeight,
              overflow: "hidden",
              touchAction: isZoomed ? "none" : "auto",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            onPointerDown={
              !isMobile
                ? (e) => {
                    if (isZoomed) {
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
                  }
                : undefined
            }
            onPointerMove={
              !isMobile
                ? (e) => {
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
                  }
                : undefined
            }
            onPointerUp={
              !isMobile
                ? (e) => {
                    if (hasDragged) {
                      setHasDragged(false);
                      setIsDragging(false);
                      dragStartRef.current = null;
                      return;
                    }

                    setIsDragging(false);
                    dragStartRef.current = null;
                    handleImageClick(e);
                  }
                : undefined
            }
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative h-full w-full grid place-items-center" data-loaded={lightboxLoaded ? "true" : "false"}>
              <span
                aria-hidden="true"
                className="gallery-shimmer absolute inset-0 transition-opacity duration-700 data-[loaded=true]:opacity-0"
              />
              {!lightboxLoaded && currentPreviewSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentPreviewSrc}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none [grid-area:1/1] block h-full w-full object-contain"
                  decoding="async"
                  draggable={false}
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={lightboxImgRef}
                src={lightboxSrc}
                alt={getImageAlt(currentIndex, currentImage)}
                loading="eager"
                className={`[grid-area:1/1] block h-full w-full object-contain transition-opacity ${
                  isMobile ? "duration-180" : "duration-300"
                } ease-out ${lightboxLoaded ? "opacity-100" : "opacity-0"}`}
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
                }}
                onError={() => {
                  setLightboxLoaded(true);
                }}
                draggable={false}
              />
            </div>

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

          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={showPrev}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[color:var(--surface-rose)] hover:bg-[color:var(--accent)] active:bg-[color:var(--accent)] backdrop-blur-sm text-white flex items-center justify-center transition-all shadow-lg border border-white/35"
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
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[color:var(--surface-rose)] hover:bg-[color:var(--accent)] active:bg-[color:var(--accent)] backdrop-blur-sm text-white flex items-center justify-center transition-all shadow-lg border border-white/35"
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
  );
}
