/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime } from "../core/runtime";
import { listen, manageObserver } from "../core/Lifecycle";
import { initCanvasEffect } from "../rendering/HalftoneRenderer";
export function initSceneProlog(): any {
  if (window.innerWidth < runtime.breakPoint) return;
  if (!runtime.globalSceneManager) return;
  const e: any = {
      desk: { width: 44, leftX: -14, rightX: 70 },
      mob: { width: 88, leftX: -25.5, rightX: 37.5 },
    },
    t: any = (): any => window.innerWidth >= runtime.breakPoint,
    o: any = (): any => (t() ? e.desk.width : e.mob.width),
    n: any = (): any => (t() ? e.desk.leftX : e.mob.leftX),
    i: any = (): any => (t() ? e.desk.rightX : e.mob.rightX);
  runtime.globalSceneManager.init("[data-prolog-scene]", (e?: any): any =>
    initCanvasEffect(e, [
      {
        type: "video",
        sources: [
          {
            src: "/assets/scenes/prolog-l-c.mp4",
            type: "video/mp4",
          },
        ],
        loop: !1,
        config: {
          x: `${n()}%`,
          y: "3%",
          width: `${o()}%`,
          height: "96%",
          blackPoint: 200,
          whitePoint: 25,
          threshold: 255,
          ySquares: 150,
          xSquares: 125,
          bgOpacity: 1,
          fillOpacity: 1,
        },
      },
      {
        type: "video",
        sources: [
          {
            src: "/assets/scenes/prolog-r-c.mp4",
            type: "video/mp4",
          },
        ],
        loop: !1,
        config: {
          x: `${i()}%`,
          y: "3%",
          width: `${o()}%`,
          height: "96%",
          blackPoint: 200,
          whitePoint: 25,
          threshold: 255,
          ySquares: 150,
          xSquares: 125,
          bgOpacity: 1,
          fillOpacity: 1,
        },
      },
    ]),
  );
}
