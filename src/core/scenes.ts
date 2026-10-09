import { runWithLifecycle } from "./Lifecycle";
import { runtime } from "./runtime";
import { initSceneHeroOver, initSceneHeroBg } from "../scenes/hero";
import { initSceneProlog } from "../scenes/prologue";
import { initSceneAbout } from "../scenes/about";
import { initSceneSeasons } from "../scenes/seasons";
import {
  initSceneBenefitsIntro,
  initSceneBenefitsOutro,
} from "../scenes/benefits";
import { initSceneFin } from "../scenes/finance";
import { initSceneDevOver, initSceneDevBg } from "../scenes/developer";
import { initSceneFactoid } from "../scenes/factoids";
import { initSceneFaq } from "../scenes/faq";
import { initSceneFooter } from "../scenes/footer";
import {
  initSceneArticleDark,
  initSceneArticleLight,
  initSceneError,
} from "../scenes/articles";
export interface Scene {
  destroy(): void;
  loaded?: Promise<unknown>;
}
export class SceneManager {
  private scenes = new Map<string, Scene>();
  private loads: Promise<unknown>[] = [];
  init(selector: string, create: (canvas: HTMLCanvasElement) => Scene): void {
    document
      .querySelectorAll<HTMLCanvasElement>(selector)
      .forEach((canvas, index) => {
        const id = `${selector}-${index}`;
        canvas.dataset.sceneId = id;
        const scene = create(canvas);
        if (scene) {
          this.scenes.set(id, scene);
          if (scene.loaded) this.loads.push(scene.loaded);
        }
      });
  }
  ready(): Promise<unknown[]> {
    return Promise.all(this.loads);
  }
  progress(callback: (loaded: number, total: number) => void): void {
    let complete = 0;
    this.loads.forEach((load) =>
      load.then(() => callback(++complete, this.loads.length)),
    );
  }
  destroy(): void {
    this.scenes.forEach((scene) => scene.destroy());
    this.scenes.clear();
    this.loads = [];
  }
}
export function initAllScenes(): void {
  runWithLifecycle(initializeScenes);
}
function initializeScenes(): void {
  runtime.globalSceneManager?.destroy();
  runtime.globalSceneManager = new SceneManager();
  [
    initSceneHeroOver,
    initSceneHeroBg,
    initSceneProlog,
    initSceneAbout,
    initSceneSeasons,
    initSceneBenefitsIntro,
    initSceneBenefitsOutro,
    initSceneFin,
    initSceneDevOver,
    initSceneDevBg,
    initSceneFactoid,
    initSceneFaq,
    initSceneFooter,
    initSceneArticleDark,
    initSceneArticleLight,
    initSceneError,
  ].forEach((init) => init());
}
