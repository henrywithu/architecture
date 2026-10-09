/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from "../core/runtime";
import { listen, manageObserver } from "../core/Lifecycle";
import { initCanvasEffect } from "../rendering/HalftoneRenderer";
export function initSceneFaq(): any {
  if (!runtime.globalSceneManager) return;
  const e: any = runtime.globalSceneManager,
    t: any = window.innerWidth >= runtime.breakPoint ? 33.33 : 100;
  e.init("[data-faq-scene]", (e?: any): any => {
    const o: any = [
        {
          type: "video",
          sources: [
            {
              src: "/assets/scenes/birds_03.hevc.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: -1 * t + "%",
            y: "0%",
            width: `${t}%`,
            height: `${t}vw`,
            blackPoint: 0,
            whitePoint: 255,
            threshold: 255,
            bgOpacity: 1,
            fillOpacity: 1,
          },
        },
        {
          type: "video",
          sources: [
            {
              src: "/assets/scenes/birds_02-c.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: -1 * t + "%",
            y: "55%",
            width: `${t}%`,
            height: `${t}vw`,
            blackPoint: 0,
            whitePoint: 255,
            threshold: 255,
            bgOpacity: 1,
            fillOpacity: 1,
          },
        },
      ],
      n: any = initCanvasEffect(e, o),
      i: any = gsap
        .timeline({ paused: !0, repeat: -1 })
        .to(o[0].config, {
          x: "100%",
          duration: window.innerWidth >= runtime.breakPoint ? 5 : 2.5,
          ease: "none",
        })
        .to(o[1].config, {
          x: "100%",
          duration: window.innerWidth >= runtime.breakPoint ? 5 : 2.5,
          ease: "none",
        })
        .to({}, { duration: 5 }),
      r: any = manageObserver(
        new IntersectionObserver(
          (e?: any): any => {
            e.forEach((e?: any): any => {
              e.isIntersecting
                ? i.paused() && i.play()
                : i.paused() || i.pause();
            });
          },
          { threshold: 0.01, rootMargin: "20% 0px 20% 0px" },
        ),
      );
    return (
      r.observe(e),
      {
        destroy: (): any => {
          (i.kill(), r.disconnect(), n?.destroy());
        },
        loaded: n?.loaded,
      }
    );
  });
}
