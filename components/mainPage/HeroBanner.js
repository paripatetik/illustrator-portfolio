"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { featuredImages } from "@/data/featuredImages";

// Компонент анімованого зображення з dragging ефектом (тільки для desktop)
function FloatingImage({ src, index }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Desktop позиціонування: 2 по боках, 2 внизу
  const positions = [
    { top: "50%", left: "5%", translateY: "-50%", rotate: -8 },   // лівий бік
    { top: "50%", right: "5%", translateY: "-50%", rotate: 5 },   // правий бік
    { bottom: "5%", left: "10%", rotate: 6 },                     // нижній лівий
    { bottom: "5%", right: "10%", rotate: -7 },                   // нижній правий
  ];

  const position = positions[index % 4];

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Обчислюємо зміщення (максимум 20px)
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;

    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={imageRef}
      className="absolute hidden lg:block cursor-grab active:cursor-grabbing"
      style={{
        ...position,
        transform: `translateY(${position.translateY || '0'}) rotate(${position.rotate}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <Image
          src={`/${src}`}
          alt=""
          width={280}
          height={280}
          className="img-rounded object-cover w-[240px] h-[240px] xl:w-[280px] xl:h-[280px]"
          priority
        />
      </div>
    </div>
  );
}

// Компонент мобільного фото з dragging ефектом
function MobileFloatingImage({ src, index }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Отримуємо координати (підтримка touch)
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

    if (!clientX || !clientY) return;

    // Обчислюємо зміщення
    const deltaX = (clientX - centerX) * 0.15;
    const deltaY = (clientY - centerY) * 0.15;

    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={imageRef}
      className="cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
    >
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) rotate(${[-4, 4, -3, 5][index % 4]}deg)`,
        }}
      >
        <Image
          src={`/${src}`}
          alt=""
          width={140}
          height={140}
          className="img-rounded object-cover w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
          priority
        />
      </div>
    </div>
  );
}

export default function HeroBanner() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="section bg-cream relative overflow-hidden min-h-[100vh] flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Ім'я */}
          <h1
            className="text-6xl md:text-8xl lg:text-9xl mb-16 md:mb-20 relative inline-block cursor-default text-foreground uppercase italic"
            style={{
              fontFamily: "var(--font-display), ui-serif, serif",
              fontWeight: 600,
              textShadow: "0 2px 8px rgba(0,0,0,0.08)",
              animation: "fadeInUp 0.8s ease-out both",
            }}
          >
            <span className="relative inline-block group">
              Olena Oprich
              {/* Анімоване підкреслення */}
              <span 
                className="absolute left-0 w-0 h-[6px] md:h-[8px] bg-accent transition-all duration-700 ease-out group-hover:w-full"
                style={{ 
                  bottom: '-0.15em',
                  boxShadow: "0 2px 8px rgba(240, 70, 99, 0.3)",
                }}
              ></span>
            </span>
          </h1>

          {/* Центральне фото з анімованими контурами */}
          <div 
            className="relative mb-6 animate-[fadeIn_1s_ease-out_0.3s_backwards] hero-photo-wrapper group cursor-pointer"
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
                className="object-cover w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[500px] lg:h-[500px] transition-all duration-500 group-hover:scale-105"
                style={{
                  boxShadow: isHovered 
                    ? "0 30px 80px rgba(0,0,0,0.3), 0 12px 30px rgba(240, 70, 99, 0.2)" 
                    : "0 20px 60px rgba(0,0,0,0.2), 0 8px 20px rgba(0,0,0,0.15)",
                  borderRadius: "24px",
                }}
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
          <p
            className="mt-5 text-4xl text-foreground relative inline-block cursor-default"
            style={{
              fontFamily: "var(--font-display), ui-serif, serif",
              fontWeight: 400,
              textShadow: "0 1px 4px rgba(0,0,0,0.06)",
              animation: "fadeInUp 0.8s ease-out 0.5s both",
            }}
          >
            <span className="relative inline-block group">
              Passionate Illustrator
              {/* Анімоване підкреслення */}
              <span 
                className="absolute left-0 w-0 h-[4px] md:h-[5px] bg-accent transition-all duration-700 ease-out group-hover:w-full"
                style={{ 
                  bottom: '-0.2em',
                  boxShadow: "0 2px 6px rgba(240, 70, 99, 0.25)",
                }}
              ></span>
            </span>
          </p>

          {/* Мобільна сітка фото (під підписом) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 lg:hidden max-w-2xl animate-[fadeIn_1s_ease-out_0.8s_backwards]">
            {featuredImages.map((imagePath, index) => (
              <MobileFloatingImage
                key={imagePath}
                src={imagePath}
                index={index}
              />
            ))}
          </div>

          {/* Desktop анімовані зображення навколо */}
          {featuredImages.map((imagePath, index) => (
            <FloatingImage
              key={imagePath}
              src={imagePath}
              index={index}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
