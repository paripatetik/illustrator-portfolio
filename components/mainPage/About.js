import Image from "next/image";

export default function About() {
  return (
    <section className="section">
      <div className="container mx-auto">
        <h2 className="section-title mx-auto max-w-[32ch]">
          The artist behind the stories
        </h2>

        <div className="mt-10 flex flex-col items-center gap-8 mx-auto max-w-[680px]">

          {/* Фото */}
          <div
            className="relative flex items-center justify-center rounded-[24px] p-[10px] border border-white/20"
            style={{
              width: "min(82vw, 400px)",
              background: "rgba(255,255,255,0.12)",
              boxShadow: "0 16px 30px rgba(156,46,68,0.28)",
              animation: "aboutFloat 8s ease-in-out infinite",
            }}
          >
            {/* Bookmark */}
            <span
              className="absolute left-5 -top-4 w-[40px] h-[58px]"
              aria-hidden="true"
              style={{ filter: "drop-shadow(0 6px 12px rgba(156,46,68,0.3))" }}
            >
              <svg viewBox="0 0 40 58" role="presentation" focusable="false" width="40" height="58">
                <path
                  d="M8 4h24a3 3 0 0 1 3 3v45l-15-9-15 9V7a3 3 0 0 1 3-3z"
                  fill="#ffffff"
                />
              </svg>
            </span>

            <Image
              src="/olena.jpg"
              alt="Olena portrait"
              width={620}
              height={760}
              className="h-auto w-full object-cover rounded-[18px] transition-[transform,filter] duration-300"
              style={{ boxShadow: "0 10px 24px rgba(0,0,0,0.18)" }}
              priority
              unoptimized
            />
          </div>

          {/* Текст */}
          <div className="px-6 text-center w-full">
            <p className="t-body text-foreground mx-auto">
              I&apos;m a children&apos;s book illustrator from Ukraine, creating
              warm and expressive illustrations filled with heart and color.
            </p>
            <p className="t-body text-foreground mx-auto mt-3">
              I love bringing stories to life through emotional characters and
              cozy storytelling worlds.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}