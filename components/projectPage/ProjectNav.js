import Link from "next/link";
import projects from "@/data/projects.json";

export default function ProjectNav({ currentSlug }) {
  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <Link
        href="/"
        className="contact-submit fixed top-4 right-4 z-50 mt-0"
      >
        Main
      </Link>

      <nav className="container mx-auto px-4 py-12 flex items-center justify-between gap-4">
        <Link href={`/projects/${prevProject.slug}`} className="contact-submit mt-0">
          ← {prevProject.title}
        </Link>

        <Link href={`/projects/${nextProject.slug}`} className="contact-submit mt-0">
          {nextProject.title} →
        </Link>
      </nav>
    </>
  );
}