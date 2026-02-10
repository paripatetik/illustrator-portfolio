"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  
  const cardRefs = useRef([]);
  const zoomFrameRef = useRef(null);
  const zoomImgRef = useRef(null);
  const dragStartRef = useRef(null);
  const lastTapRef = useRef(0);

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

  const openLightbox = (index) => {
    setLightboxLoaded(false);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setIsDragging(false);
    setHasDragged(false);
    setLightboxLoaded(false);
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxLoaded(false);
    setLightboxIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setHasDragged(false);
  };

  const showNext = (e) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxLoaded(false);
    setLightboxIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
    setZoomOrigin({ x: 50, y: 50 });
    setHasDragged(false);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;

    const current = galleryImages[lightboxIndex];
    const next = galleryImages[(lightboxIndex + 1) % totalImages];
    const prev = galleryImages[(lightboxIndex - 1 + totalImages) % totalImages];

    [current, next, prev].forEach((img) => {
      if (!img) return;
      const preload = new window.Image();
      preload.src = `/projects/${folder}/${img}`;
    });
  }, [lightboxIndex, folder, galleryImages, totalImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (event) => {
      if (lightboxIndex === null) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, totalImages]);

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
    
    // Check if click is within the actual image bounds
    if (zoomImgRef.current) {
      const imgRect = zoomImgRef.current.getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      // Check if click is outside the actual rendered image
      if (
        clickX < imgRect.left ||
        clickX > imgRect.right ||
        clickY < imgRect.top ||
        clickY > imgRect.bottom
      ) {
        return; // Click is outside the image
      }
    }
    
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
        <div className="flex flex-wrap gap-6 w-full justify-center">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => openLightbox(index)}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="group relative w-full sm:flex-[0_1_calc(50%-12px)] overflow-hidden img-rounded bg-white/85 p-[6px] text-left transition-transform duration-300 hover:-translate-y-1 mb-6 opacity-0 translate-y-4 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 data-[visible=true]:animate-[fadeInUp_0.8s_ease-out_var(--delay)_both] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:animate-none cursor-pointer"
              style={{ "--delay": `${index * 80}ms` }}
            >
              <span className="sr-only">
                Open image {index + 1} in lightbox
              </span>
              <span className="absolute inset-0 rounded-[22px] ring-1 ring-foreground/10 pointer-events-none" />
              <div
                className="relative w-full overflow-hidden rounded-[18px] bg-foreground/5"
                data-loaded={loadedMap[image] ? "true" : "false"}
              >
                <span
                  aria-hidden="true"
                  className="shimmer absolute inset-0 transition-opacity duration-700 data-[loaded=true]:opacity-0"
                />
                <Image
                  src={`/projects/${folder}/${image}`}
                  alt={`${title} artwork ${index + 2}`}
                  width={
                    imageDimensions[`projects/${folder}/${image}`]?.width || 1600
                  }
                  height={
                    imageDimensions[`projects/${folder}/${image}`]?.height || 1200
                  }
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className={`block w-full h-auto transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.012] transform-gpu will-change-transform ${
                    loadedMap[image]
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-[1.01] blur-[6px]"
                  }`}
                  loading="lazy"
                  fetchPriority="low"
                  quality={85}
                  onLoadingComplete={() => {
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
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center px-4 py-6 animate-[fadeIn_0.25s_ease-out] motion-reduce:animate-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery lightbox`}
        >
          {/* Background close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute inset-0"
            aria-label="Close lightbox"
            tabIndex={-1}
          />
          
          {/* Content container */}
          <div className="relative z-[1] w-full max-w-7xl">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-white/70 text-sm font-medium">
                {currentNumber} / {totalImages}
              </span>
              <div className="flex items-center gap-3">
                {isMobile && (
                  <span className="text-white/50 text-xs">
                    Double tap to zoom
                  </span>
                )}
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-white flex items-center justify-center transition-colors"
                  aria-label="Close lightbox"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
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

            {/* Image container */}
            <div className="relative flex items-center justify-center">
              <div
                ref={zoomFrameRef}
                className={`relative overflow-hidden rounded-2xl transition-shadow duration-300 select-none inline-block ${
                  isZoomed 
                    ? isDragging 
                      ? "cursor-grabbing shadow-2xl" 
                      : "cursor-grab shadow-2xl"
                    : "cursor-zoom-in shadow-xl"
                }`}
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
                style={{ 
                  touchAction: isZoomed ? 'none' : 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  maxWidth: '100%',
                }}
              >
                <div
                  className="relative"
                  data-loaded={lightboxLoaded ? "true" : "false"}
                >
                  <span
                    aria-hidden="true"
                    className="shimmer absolute inset-0 transition-opacity duration-700 data-[loaded=true]:opacity-0"
                  />
                  <img
                    ref={zoomImgRef}
                    src={lightboxSrc}
                    alt={`${title} detail ${lightboxIndex + 1}`}
                    className={`block w-full h-auto max-h-[75vh] object-contain transition-[transform,opacity,filter] duration-600 ease-out ${
                      lightboxLoaded
                        ? "opacity-100 scale-100 blur-0"
                        : "opacity-0 scale-[1.01] blur-[6px]"
                    }`}
                    decoding="async"
                    style={{
                      transform: isZoomed 
                        ? `scale(2) translate(${dragOffset.x / 2}px, ${dragOffset.y / 2}px)`
                        : 'scale(1)',
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }}
                    onLoad={() => {
                      requestAnimationFrame(() => {
                        setLightboxLoaded(true);
                      });
                    }}
                    onError={() => setLightboxLoaded(true)}
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
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <path d="M11 8v6M8 11h6"/>
                    </svg>
                    <span>Drag to pan • Click to zoom out</span>
                  </div>
                )}
              </div>

              {/* Desktop navigation arrows */}
              <button
                type="button"
                onClick={showPrev}
                className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white items-center justify-center transition-all shadow-xl border border-white/10 z-10"
                aria-label="Previous image"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
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
                className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white items-center justify-center transition-all shadow-xl border border-white/10 z-10"
                aria-label="Next image"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
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

            {/* Mobile navigation buttons */}
            <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
              <button
                type="button"
                onClick={showPrev}
                className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-xl border border-white/10"
                aria-label="Previous image"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
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
                className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-xl border border-white/10"
                aria-label="Next image"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
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
      )}

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            100deg,
            rgba(0, 0, 0, 0.03) 20%,
            rgba(0, 0, 0, 0.08) 40%,
            rgba(0, 0, 0, 0.03) 60%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
          transition: opacity 0.7s ease;
        }

        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shimmer {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
