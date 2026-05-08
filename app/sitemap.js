import projects from "@/data/projects.json";
import { absoluteUrl } from "@/lib/seo";

const projectsList = Array.isArray(projects) ? projects : projects?.default ?? [];

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectsList.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
