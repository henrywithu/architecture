/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from "../core/runtime";
import { listen, manageObserver } from "../core/Lifecycle";
import { initCanvasEffect } from "../rendering/HalftoneRenderer";
export function initSceneDevOver(): any {
  if (window.innerWidth < runtime.breakPoint) return;
  if (!runtime.globalSceneManager) return;
  runtime.globalSceneManager.init("[data-dev-over-scene]", (e?: any): any => {
    const t: any = [
        {
          type: "video",
          sources: [
            {
              src: "/assets/scenes/claudes_01.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: "30%",
            y: "0%",
            width: "65%",
            height: "45vw",
            blackPoint: 25,
            whitePoint: 255,
            threshold: 255,
            bgOpacity: 1,
            fillOpacity: 1,
          },
        },
      ],
      o: any = initCanvasEffect(e, t),
      n: any = gsap
        .timeline({
          scrollTrigger: {
            trigger: e,
            start: "top bottom",
            end: "bottom top",
            scrub: !0,
          },
        })
        .to(t[0].config, { x: "60%", ease: "none" });
    return {
      destroy: (): any => {
        (n.scrollTrigger?.kill(), n.kill(), o?.destroy());
      },
      loaded: o?.loaded,
    };
  });
}
export function initSceneDevBg(): any {
  if (window.innerWidth < runtime.breakPoint) return;
  if (!runtime.globalSceneManager) return;
  const e: any = runtime.globalSceneManager,
    t: any = window.innerWidth >= runtime.breakPoint ? 33.33 : 100;
  e.init("[data-dev-bg-scene]", (e?: any): any => {
    const o: any = [
        {
          type: "video",
          sources: [
            {
              src: "/assets/scenes/claudes_02.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: "5%",
            y: "35%",
            width: "65%",
            height: "45vw",
            blackPoint: 25,
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
              src: "/assets/scenes/birds_03.hevc.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: -1 * t + "%",
            y: "5%",
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
            y: "50%",
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
              src: "/assets/scenes/birds_04.hevc.mp4",
              type: "video/mp4",
            },
          ],
          config: {
            x: -1 * t + "%",
            y: "80%",
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
        .timeline({
          scrollTrigger: {
            trigger: e,
            start: "top bottom",
            end: "bottom top",
            scrub: !0,
          },
        })
        .to(o[0].config, { x: "-30%", ease: "none" }),
      r: any = gsap
        .timeline({ paused: !0 })
        .to(
          o[1].config,
          { x: "100%", duration: 5, ease: "none", repeat: -1, repeatDelay: 5 },
          "<",
        )
        .to(
          o[3].config,
          { x: "100%", duration: 5, ease: "none", repeat: -1, repeatDelay: 5 },
          "<",
        )
        .to(
          o[2].config,
          {
            x: "100%",
            duration: 5,
            ease: "none",
            delay: 5,
            repeat: -1,
            repeatDelay: 5,
          },
          "<",
        ),
      a: any = manageObserver(
        new IntersectionObserver(
          (e?: any): any => {
            e.forEach((e?: any): any => {
              e.isIntersecting
                ? r.paused() && r.play()
                : r.paused() || r.pause();
            });
          },
          { threshold: 0.01, rootMargin: "20% 0px 20% 0px" },
        ),
      );
    return (
      a.observe(e),
      {
        destroy: (): any => {
          (i.scrollTrigger?.kill(),
            i.kill(),
            r.kill(),
            a.disconnect(),
            n?.destroy());
        },
        loaded: n?.loaded,
      }
    );
  });
}
