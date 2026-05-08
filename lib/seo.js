export const siteName = "Olena Oprich";
export const siteTitle = "Olena Oprich | Children's Book Illustrator";
export const siteDescription =
  "Portfolio of Olena Oprich, a children's book illustrator creating warm, expressive, and colorful storybook art.";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export function getProjectCover(project) {
  const cover = project.images?.find((image) => image.includes("-cover")) || project.images?.[0];
  return cover ? `/projects/${project.slug}/${cover}` : "/olena_hero.jpg";
}
