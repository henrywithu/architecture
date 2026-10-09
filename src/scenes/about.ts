/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from "../core/runtime";
import { listen, manageObserver } from "../core/Lifecycle";
import { initCanvasEffect } from "../rendering/HalftoneRenderer";
export function initSceneAbout(): any {
  if (window.innerWidth < runtime.breakPoint) return;
  if (!runtime.globalSceneManager) return;
  const e: any = runtime.globalSceneManager,
    t: any = window.innerWidth >= runtime.breakPoint ? 33.33 : 100;
  e.init("[data-about-scene]", (e?: any): any => {
    const o: any = [
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
            y: "10%",
            width: `${t}%`,
            height: `${t}vw`,
            blackPoint: 255,
            whitePoint: 0,
            threshold: 255,
            bgOpacity: 1,
            fillOpacity: 1,
          },
        },
        {
          type: "video",
          sources: [
            {
              src: "/assets/scenes/about_stork-c.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: "45%",
            y: "65%",
            width: "40%",
            height: "36vw",
            blackPoint: 160,
            whitePoint: 0,
            threshold: 255,
            bgOpacity: 1,
            fillOpacity: 1,
          },
        },
      ],
      n: any = gsap
        .timeline({ paused: !0 })
        .to(o[0].config, {
          x: "100%",
          duration: 5,
          ease: "none",
          repeat: -1,
          repeatDelay: 5,
        })
        .to(
          o[1].config,
          {
            x: "-40%",
            y: "0%",
            duration: 6,
            ease: "none",
            delay: 4,
            repeat: -1,
            repeatDelay: 6,
          },
          "<",
        ),
      i: any = initCanvasEffect(e, o),
      r: any = manageObserver(
        new IntersectionObserver(
          (e?: any): any => {
            e.forEach((e?: any): any => {
              e.isIntersecting
                ? n.paused() && n.play()
                : n.paused() || n.pause();
            });
          },
          { threshold: 0.01, rootMargin: "20% 0px 20% 0px" },
        ),
      );
    return (
      r.observe(e),
      {
        destroy: (): any => {
          (n.kill(), r.disconnect(), i?.destroy());
        },
        loaded: i?.loaded,
      }
    );
  });
}
