"use client";

import Image from "next/image";
import { useState } from "react";

function getHeroImage(images = []) {
  return images.find((image) => image.startsWith("01")) || images[0];
}

export default function ProjectHero({ project, folder }) {
  const heroImage = getHeroImage(project.images);
  const metaLine = [project.client, project.year].filter(Boolean).join(" • ");
  
  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--spot-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--spot-y", `${y.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--spot-opacity", "1");
  };

  const handleHeroEnter = (event) => {
    event.currentTarget.style.setProperty("--spot-opacity", "1");
  };

  const handleHeroLeave = (event) => {
    event.currentTarget.style.setProperty("--spot-opacity", "0");
  };

  return (
    <section className="section py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile/Tablet: Title First (shown below lg) */}
        <div 
          className="lg:hidden mb-8 text-center"
          style={{ animation: "fadeInUp 0.8s ease both" }}
        >
          <h1
            className="text-4xl sm:text-5xl mb-4"
            style={{
              fontFamily: "var(--font-fun), ui-sans-serif, sans-serif",
              fontWeight: 600,
            }}
          >
            {project.title}
          </h1>
        </div>

        {/* Desktop: Side by Side Layout */}
        <div 
          className="w-full"
          style={{ animation: "fadeInUp 0.8s ease both" }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start max-w-[2000px] mx-auto">
            {/* Hero Image */}
            <div
              className="w-full lg:flex-1 flex justify-center"
              style={{ animation: "fadeIn 0.9s ease both", animationDelay: "0.1s" }}
            >
              <div
                className="relative inline-block overflow-hidden img-rounded hero-frame group cursor-pointer"
                onMouseEnter={handleHeroEnter}
                onMouseMove={handleHeroMove}
                onMouseLeave={handleHeroLeave}
              >
                <Image
                  src={`/projects/${folder}/${heroImage}`}
                  alt={`${project.title} hero`}
                  width={2400}
                  height={2400}
                  className="hero-image block"
                  style={{ 
                    maxHeight: '80vh',
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                  }}
                  priority
                  quality={100}
                />
              </div>
            </div>

            {/* Text Content - Desktop Only (lg and above) */}
            <div 
              className="hidden lg:flex lg:flex-col lg:w-[380px] xl:w-[420px] gap-6 lg:sticky lg:top-24"
              style={{ animation: "fadeInUp 0.9s ease both", animationDelay: "0.2s" }}
            >
              <div>
                <h1
                  className="text-4xl xl:text-5xl mb-4 leading-tight"
                  style={{
                    fontFamily: "var(--font-fun), ui-sans-serif, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {project.title}
                </h1>
                {metaLine && (
                  <p className="text-base text-foreground/50 mb-6">
                    {metaLine}
                  </p>
                )}
              </div>
              
              <p className="text-lg xl:text-xl leading-relaxed text-foreground/75">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Description Below Image (shown below lg) */}
        <div 
          className="lg:hidden mt-8 text-center max-w-2xl mx-auto"
          style={{ animation: "fadeInUp 0.8s ease both", animationDelay: "0.3s" }}
        >
          <p className="t-body text-foreground/75">
            {project.description}
          </p>
          {metaLine && (
            <p className="text-sm text-foreground/50 mt-3">{metaLine}</p>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .hero-frame {
          position: relative;
        }

        .hero-image {
          transition: transform 0.5s ease;
        }

        .hero-frame:hover .hero-image {
          transform: scale(1.02);
        }

        @media (min-width: 768px) {
          .hero-frame::before {
            content: '';
            position: absolute;
            top: var(--spot-y, 50%);
            left: var(--spot-x, 50%);
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(255, 107, 122, 0.15) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            opacity: var(--spot-opacity, 0);
            transition: opacity 0.3s ease;
            z-index: 10;
          }
        }
      `}</style>
    </section>
  );
}