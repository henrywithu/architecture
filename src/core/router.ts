import routes from "../pages/routes.json";
import { runtime, gsapCore, ScrollTriggerCore } from "./runtime";
import { animateTransition } from "../motion/transition";
import { initScripts } from "./initialize";
import { initAllScenes, SceneManager } from "./scenes";
import { initLenis, unlockScroll } from "./scroll";
import { Lifecycle, useLifecycle, listen } from "./Lifecycle";
import { updateMetadata } from "./metadata";
const templates = import.meta.glob("../pages/templates/*.html", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;
let routeScope: Lifecycle;
let busy = false;
let registered = false;
let currentPath = location.pathname;
export function setRouteScope(scope: Lifecycle): void {
  routeScope = scope;
}
export function routeExists(path: string): boolean {
  return path === "/en" || path === "/" || path in routes;
}
export async function renderInitialRoute(path: string): Promise<void> {
  path = path.replace(/\/+$/, "") || "/";
  updateMetadata(path);
  if (path === "/en" || path === "/") return;
  const data = routes[path as keyof typeof routes];
  if (!data) return;
  const main = document.querySelector(".transition-container");
  if (main)
    main.outerHTML = await templates[`../pages/templates/${data.name}.html`]();
  document.documentElement.dataset.wfPage = data.pageId;
}
function initializeRoute(): void {
  useLifecycle(routeScope);
  initScripts();
  ScrollTriggerCore.refresh();
}
export function initPageTransitions(): void {
  initializeRoute();
  if (registered) return;
  registered = true;
}
export function attachRouter(scope: Lifecycle): void {
  useLifecycle(scope);
  history.scrollRestoration = "manual";
  listen(document, "click", (event) => {
    const anchor = (event.target as Element)?.closest<HTMLAnchorElement>(
      "a[href]",
    );
    if (!anchor || event.defaultPrevented) return;
    const mouse = event as MouseEvent;
    if (mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey)
      return;
    const href = anchor.getAttribute("href") || "";
    if (href === "#") {
      event.preventDefault();
      return;
    }
    if (href.startsWith("#")) {
      event.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (target) {
        history.replaceState(null, "", href);
        runtime.lenis?.scrollTo(target, { duration: runtime.durL });
      }
      return;
    }
    const url = new URL(anchor.href);
    if (url.origin === location.origin && routeExists(url.pathname)) {
      event.preventDefault();
      void navigate(url.pathname, true, url.hash);
    }
  });
  listen(window, "popstate", () => {
    void navigate(location.pathname, false, location.hash);
  });
}
export async function navigate(
  path: string,
  push = true,
  hash = "",
): Promise<void> {
  path = path.replace(/\/+$/, "") || "/";
  if (busy) return;
  busy = true;
  try {
    sessionStorage.setItem(`scroll:${currentPath}`, String(scrollY));
    animateTransition("in");
    await gsapCore.to({}, { duration: runtime.durL });
    ScrollTriggerCore.getAll().forEach((trigger) => trigger.kill());
    runtime.globalSceneManager?.destroy();
    runtime.globalSceneManager = null;
    routeScope.dispose();
    document
      .querySelectorAll<HTMLElement>("*")
      .forEach((element) => element._split?.revert());
    const data = routes[(path === "/" ? "/en" : path) as keyof typeof routes];
    if (data) {
      document.querySelector(".transition-container")!.outerHTML =
        await templates[`../pages/templates/${data.name}.html`]();
      updateMetadata(path);
      document.documentElement.dataset.wfPage = data.pageId;
    }
    if (push) history.pushState(null, "", path + hash);
    currentPath = path;
    routeScope = new Lifecycle();
    useLifecycle(routeScope);
    initLenis();
    initializeRoute();
    initAllScenes();
    await Promise.all([
      (runtime.globalSceneManager as SceneManager | null)?.ready(),
      document.fonts.ready,
    ]);
    runtime.lenis?.scrollTo(
      push ? 0 : Number(sessionStorage.getItem(`scroll:${path}`) || 0),
      { immediate: true },
    );
    ScrollTriggerCore.refresh();
    animateTransition("out");
    unlockScroll();
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) runtime.lenis?.scrollTo(target, { duration: runtime.durL });
    }
  } finally {
    busy = false;
  }
}
export function disposeRouter(): void {
  registered = false;
  busy = false;
  routeScope?.dispose();
}
