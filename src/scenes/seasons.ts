/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from "../core/runtime";
import { listen, manageObserver } from "../core/Lifecycle";
import { initCanvasEffect } from "../rendering/HalftoneRenderer";
export function initSceneSeasons(): any {
  if (window.innerWidth < runtime.breakPoint) return;
  if (!runtime.globalSceneManager) return;
  runtime.globalSceneManager.init("[data-seasons-scene]", (e?: any): any => {
    const t: any = e.closest("[data-tabs-text]");
    if (!t) return;
    const o: any = t.querySelector('[data-tab-trigger="summer"]'),
      n: any = t.querySelector('[data-tab-trigger="winter"]'),
      i: any = [
        {
          type: "video",
          sources: [
            {
              src: "/assets/scenes/seasons_summer.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: "16%",
            y: "0%",
            width: "84%",
            height: "100%",
            blackPoint: 0,
            whitePoint: 255,
            threshold: 255,
            bgOpacity: 1,
            fillOpacity: 0,
          },
        },
        {
          type: "video",
          sources: [
            {
              src: "/assets/scenes/seasons_winter.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: "4%",
            y: "-8%",
            width: "50%",
            height: "100%",
            blackPoint: 0,
            whitePoint: 1,
            threshold: 255,
            bgOpacity: 1,
            fillOpacity: 0,
          },
        },
      ],
      r: any = initCanvasEffect(e, i),
      a: any = (): any => {
        (gsap.to(i[0].config, {
          blackPoint: 0,
          whitePoint: 255,
          duration: runtime.durL,
        }),
          gsap.to(i[1].config, {
            blackPoint: 254,
            whitePoint: 255,
            duration: runtime.durL,
          }));
      },
      s: any = (): any => {
        (gsap.to(i[0].config, {
          blackPoint: 254,
          whitePoint: 255,
          duration: runtime.durL,
        }),
          gsap.to(i[1].config, {
            blackPoint: 25,
            whitePoint: 150,
            duration: runtime.durL,
          }));
      },
      c: any = (): any => {
        o?.classList.contains("is-active")
          ? a()
          : n?.classList.contains("is-active") && s();
      };
    return (
      listen(o, "click", a),
      listen(n, "click", s),
      c(),
      {
        destroy: (): any => {
          (o.removeEventListener("click", a),
            n.removeEventListener("click", s),
            r?.destroy());
        },
        loaded: r?.loaded,
      }
    );
  });
}
