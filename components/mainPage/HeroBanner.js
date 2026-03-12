"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { featuredImages } from "@/data/featuredImages";

// Компонент анімованого зображення з dragging ефектом (тільки для desktop)
function FloatingImage({ src, index, isMobile }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (!clientX || !clientY) return;
    setOffset({
      x: (clientX - (rect.left + rect.width / 2)) * 0.15,
      y: (clientY - (rect.top + rect.height / 2)) * 0.15,
    });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const desktopPositions = [
    { top: "50%", left: "5%", translateY: "-50%", rotate: -8 },
    { top: "50%", right: "5%", translateY: "-50%", rotate: 5 },
    { bottom: "5%", left: "10%", rotate: 6 },
    { bottom: "5%", right: "10%", rotate: -7 },
  ];

  const rotate = isMobile
    ? [-4, 4, -3, 3][index % 4]
    : desktopPositions[index % 4].rotate;

  const { translateY, rotate: _, ...desktopPos } = isMobile
    ? {}
    : desktopPositions[index % 4];

  return (
    <div
      ref={imageRef}
      className={isMobile ? "" : "absolute hidden lg:block cursor-grab active:cursor-grabbing"}
      style={isMobile ? {} : { ...desktopPos, transform: `translateY(${translateY ?? "0"}) rotate(${rotate}deg)` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
    >
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)${isMobile ? ` rotate(${rotate}deg)` : ""}`,
        }}
      >
        <Image
          src={`/${src}`}
          alt=""
          width={280}
          height={280}
          className={
  isMobile
    ? "rounded-[var(--radius-card)] border border-white/70 object-cover w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
    : "img-rounded object-cover w-[240px] h-[240px] xl:w-[280px] xl:h-[280px]"
}
          priority
        />
      </div>
    </div>
  );
}


export default function HeroBanner() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative overflow-hidden min-h-[100vh] flex items-center justify-center ">
      <div className="container mx-auto">
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Ім'я */}
          <h1
            className="group mb-16 md:mb-20 relative inline-block w-auto max-w-none cursor-default text-foreground uppercase tracking-[0.08em] text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              fontFamily: "var(--font-heading), ui-serif, serif",
              fontWeight: 600,
              textShadow: "0 2px 8px rgba(0,0,0,0.08)",
              animation: "fadeInUp 0.8s ease-out both",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[-1.4rem] md:left-[-2.4rem] top-1/2 -translate-y-1/2 -translate-x-2 text-accent opacity-0 scale-75 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:animate-pulse"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
            >
              ❤
            </span>
            Olena Oprich
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[-1.4rem] md:right-[-2.4rem] top-1/2 -translate-y-1/2 translate-x-2 text-accent opacity-0 scale-75 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:animate-pulse"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
            >
              ❤
            </span>
          </h1>

          {/* Центральне фото з анімованими контурами */}
          <div 
            className="relative mb-6 animate-[fadeIn_1s_ease-out_0.3s_backwards] group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Анімовані контури навколо фото */}
            <div className="absolute inset-0 rounded-[24px] pointer-events-none">
              {/* Перший контур - accent (рожевий) */}
              <div 
                className="absolute inset-0 rounded-[24px] border-2 border-accent/40"
                style={{
                  animation: `pulseOutline 3s ease-in-out infinite`,
                  animationDelay: '0s',
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              ></div>
              {/* Другий контур - mint (м'ятний) */}
              <div 
                className="absolute inset-0 rounded-[24px] border-2 border-mint/40"
                style={{
                  animation: `pulseOutline 3s ease-in-out infinite`,
                  animationDelay: '1s',
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              ></div>
              {/* Третій контур - foreground (чорний) */}
              <div 
                className="absolute inset-0 rounded-[24px] border-2 border-foreground/25"
                style={{
                  animation: `pulseOutline 3s ease-in-out infinite`,
                  animationDelay: '2s',
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              ></div>
            </div>

            {/* Фото */}
            <div className="relative overflow-hidden rounded-[24px]">
              <Image
                src="/olena.jpg"
                alt="Olena Oprich"
                width={500}
                height={500}
                className="shadow-xl object-cover w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[500px] lg:h-[500px] transition-all duration-500 hover:scale-105"
          
                priority
              />
              
              {/* Gradient overlay при hover */}
              <div 
                className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(240, 70, 99, 0.1) 0%, rgba(122, 186, 170, 0.1) 100%)",
                }}
              ></div>
            </div>
          </div>

          {/* Підпис */}
          <div className="mt-4 h-[3px] bg-foreground/60 w-3/5 max-w-[420px]" />
          <p
            className="mt-4 t-body text-foreground relative inline-block cursor-default text-3xl sm:text-4xl md:text-5xl"
            style={{
              textShadow: "0 1px 4px rgba(0,0,0,0.06)",
              animation: "fadeInUp 0.8s ease-out 0.5s both",
            }}
          >
            Hi there!
          </p>

        {/*  mobile grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 lg:hidden">
  {featuredImages.map((src, i) => (
    <FloatingImage key={src} src={src} index={i} isMobile />
  ))}
</div>

 {/*  desktop absolute */}
{featuredImages.map((src, i) => (
  <FloatingImage key={src} src={src} index={i} isMobile={false} />
))}
        </div>
      </div>

    </section>
  );
}
