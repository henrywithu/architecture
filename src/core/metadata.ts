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
  const creator = { "@type": "Person", name: "Henry", url: "https://henrywithu.com/about/" };
  const schema = post ? {
    "@context": "https://schema.org", "@type": "Article", headline: post.title,
    description: summary, mainEntityOfPage: url, image: origin + post.image,
    author: creator, publisher: { "@type": "Organization", name: "Trapnest", url: "https://henrywithu.com/" },
    isBasedOn: `https://henrywithu.com/${post.source}/`,
  } : {
    "@context": "https://schema.org", "@type": "WebSite", name: "Trapnest Architecture",
    url: origin + "/", description,
    isPartOf: { "@type": "WebSite", name: "Trapnest", url: "https://henrywithu.com/" }, creator,
  };
  const structuredData = document.querySelector("#site-schema");
  if (structuredData) structuredData.textContent = JSON.stringify(schema);
}
