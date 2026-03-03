import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import ProjectHeader from "@/components/projectPage/ProjectHeader";
import ProjectHero from "@/components/projectPage/ProjectHero";
import ProjectCards from "@/components/projectPage/ProjectCards";
import ProjectNav from "@/components/projectPage/ProjectNav";

const projectsList = Array.isArray(projects) ? projects : projects?.default ?? [];

export function generateStaticParams() {
  return projectsList.map((project) => ({ slug: project.slug }));
}

/* This function is used to clean up the slug for display purposes, but the actual slug matching is done against the original slug from the projects list.
function slugifyTitle(title = "") { 
  return title 
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
} 
*/

export default async function ProjectPage({ params }) {
  const { slug } = await params;
 // const rawSlug = decodeURIComponent(slug || "");
 // const cleanedSlug = slugifyTitle(rawSlug);
  const project =
    projectsList.find((item) => item.slug === slug);

  if (!project) {
    return (
      <main className="h-[100vh] text-center">
        <div className="container mx-auto px-4 ]">
          <h1 className="section-title">Project Not Found</h1>
          <p className="t-body text-foreground/80 mt-4">
            Requested project: <span className="font-semibold">{slug}</span>
          </p>
          <p className="t-body text-foreground/70 mt-2">
            Available project: {projectsList.map((item) => item.slug).join(", ")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ProjectHeader />
      <ProjectHero project={project} folder={project.slug} />
      <ProjectCards
        images={project.images}
        folder={project.slug}
        title={project.title}
      />
      <ProjectNav currentSlug={slug} />
    </main>
  );
}
