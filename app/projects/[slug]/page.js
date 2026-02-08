import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import ProjectHero from "@/components/projectPage/ProjectHero";
import ProjectCards from "@/components/projectPage/ProjectCards";

const projectsList = Array.isArray(projects) ? projects : projects?.default ?? [];

export function generateStaticParams() {
  return projectsList.map((project) => ({ slug: project.slug }));
}

function slugifyTitle(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const rawSlug = decodeURIComponent(slug || "");
  const cleanedSlug = slugifyTitle(rawSlug);
  const project =
    projectsList.find((item) => item.slug === cleanedSlug) ||
    projectsList.find((item) => slugifyTitle(item.title) === cleanedSlug);

  if (!project) {
    return (
      <main className="bg-cream text-foreground section">
        <div className="container mx-auto px-4">
          <h1 className="t-section">Project Not Found</h1>
          <p className="t-body text-foreground/80 mt-4">
            Requested slug: <span className="font-semibold">{cleanedSlug}</span>
          </p>
          <p className="t-body text-foreground/70 mt-2">
            Available slugs: {projectsList.map((item) => item.slug).join(", ")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream text-foreground">
      <ProjectHero project={project} folder={project.slug} />
      <ProjectCards
        images={project.images}
        folder={project.slug}
        title={project.title}
      />
    </main>
  );
}
