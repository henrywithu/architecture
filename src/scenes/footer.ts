/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime } from "../core/runtime";
import { listen, manageObserver } from "../core/Lifecycle";
import { initCanvasEffect } from "../rendering/HalftoneRenderer";
export function initSceneFooter(): any {
  if (!runtime.globalSceneManager) return;
  runtime.globalSceneManager.init("[data-footer-scene]", (e?: any): any =>
    initCanvasEffect(e, [
      {
        type: "video",
        sources: [
          {
            src: "/assets/scenes/footer_mountain.hevc.mp4",
            type: "video/mp4",
          },
        ],
        config: {
          x: "0%",
          y: "67.5%",
          width: "100%",
          height: "32.5%",
          blackPoint: 240,
          whitePoint: 50,
          threshold: 255,
          bgOpacity: 1,
          fillOpacity: 0,
        },
      },
      {
        type: "video",
        sources: [
          {
            src: "/assets/scenes/footer_sheeps-c.mp4",
            type: "video/mp4",
          },
        ],
        config: {
          x: "30%",
          y: "5%",
          width: "40%",
          height: "95%",
          blackPoint: 0,
          whitePoint: 215,
          threshold: 255,
          ySquares: 125,
          xSquares: 150,
          bgOpacity: 1,
          fillOpacity: 1,
        },
      },
    ]),
  );
}
