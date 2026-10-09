/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime } from "../core/runtime";
import { listen, manageObserver } from "../core/Lifecycle";
import { initCanvasEffect } from "../rendering/HalftoneRenderer";
export function initSceneFactoid(): any {
  if (!runtime.globalSceneManager) return;
  runtime.globalSceneManager.init("[data-factoid-scene]", (e?: any): any =>
    initCanvasEffect(e, [
      {
        type: "video",
        sources: [
          {
            src: "/assets/scenes/factoids_river-c.mp4",
            type: "video/mp4",
          },
        ],
        config: {
          x: "0%",
          y: "0%",
          width: "100%",
          height: "100%",
          blackPoint: 75,
          whitePoint: 175,
          threshold: 255,
          bgOpacity: 1,
          fillOpacity: 1,
        },
      },
      {
        type: "video",
        sources: [
          {
            src: "/assets/scenes/factoids_sheeps-c.mp4",
            type: "video/mp4",
          },
        ],
        config: {
          x: "15%",
          y: "15%",
          width: "60%",
          height: "40%",
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
            src: "/assets/scenes/factoids_person-cc.mp4",
            type: "video/mp4",
          },
        ],
        config: {
          x: "32.5%",
          y: "32.5%",
          width: "35%",
          height: "50%",
          blackPoint: 25,
          whitePoint: 225,
          threshold: 255,
          bgOpacity: 1,
          fillOpacity: 1,
        },
      },
    ]),
  );
}
