"use client";

import { useRouter } from "next/navigation";

export default function ProjectHeader() {
  const router = useRouter();

  return (
    <header className="pt-6 md:pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center gap-3 md:min-h-12 md:flex-row md:justify-center">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
                return;
              }
              router.push("/");
            }}
            className="contact-submit mt-0 max-[800px]:fixed max-[800px]:top-4 max-[800px]:right-4 max-[800px]:z-50 md:absolute md:left-0 inline-flex items-center gap-2 px-4 py-2 text-sm md:text-base"
            aria-label="Back to main page"
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>

          <h2 className="section-title">
            Olena Oprich&apos;s Projects
          </h2>
        </div>
      </div>
    </header>
  );
}
