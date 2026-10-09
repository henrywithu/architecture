import routes from "../pages/routes.json";
import journal from "../content/journal.json";

const origin = "https://architecture.henrywithu.com";
const description = "A spatial project by Henry. Explore architecture, atmosphere, material, and interactive design in the Trapnest universe.";

/** Keep browser navigation in sync with the crawlable metadata generated at build time. */
export function updateMetadata(path: string): void {
  const route = routes[path as keyof typeof routes];
  if (!route) return;
  const post = journal.posts.find((post) => route.canonical === `/journal/${post.slug}`);
  const summary = post?.description ?? description;
  const url = origin + route.canonical;
  document.title = route.title;
  document.documentElement.lang = "en";
  const values: Record<string, string> = {
    'meta[name="description"]': summary,
    'meta[property="og:title"]': route.title,
    'meta[property="og:description"]': summary,
    'meta[property="og:url"]': url,
    'meta[property="og:type"]': post ? "article" : "website",
    'meta[name="twitter:title"]': route.title,
    'meta[name="twitter:description"]': summary,
  };
  for (const [selector, value] of Object.entries(values))
    document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", value);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", url);
}
