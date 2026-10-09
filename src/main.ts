import "./styles/reset.css";
import "./styles/reference-layout.css";
import "./styles/preloader.css";
import "./styles/inputs.css";
import "./styles/selection.css";
import "./styles/tokens.css";
import "./styles/controls.css";
import "./styles/effects.css";
import "./styles/motion.css";
import "./styles/apartment-tabs.css";
import "lenis/dist/lenis.css";
import { HomePage } from "./components/HomePage";
import { Lifecycle, useLifecycle } from "./core/Lifecycle";
import {
  runtime,
  loadHeroFrames,
  gsapCore,
  ScrollTriggerCore,
} from "./core/runtime";
import { initPreloader } from "./motion/preloader";
import {
  attachRouter,
  setRouteScope,
  renderInitialRoute,
  disposeRouter,
} from "./core/router";
const app = document.querySelector<HTMLDivElement>("#app")!;
const page = new HomePage();
const appScope = new Lifecycle();
const routeScope = new Lifecycle();
page.mount(app);
await renderInitialRoute(location.pathname);
loadHeroFrames();
setRouteScope(routeScope);
attachRouter(appScope);
useLifecycle(routeScope);
routeScope.run(initPreloader);
function dispose(): void {
  appScope.dispose();
  disposeRouter();
  runtime.globalSceneManager?.destroy();
  window.siteAudio?.pause();
  ScrollTriggerCore.getAll().forEach((trigger) => trigger.kill());
  gsapCore.globalTimeline.clear();
  page.destroy();
  app.replaceChildren();
  document.documentElement.style.overflow = "";
  document.body.style.paddingRight = "";
}
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(dispose);
}
