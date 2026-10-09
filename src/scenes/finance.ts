/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';
import { initCanvasEffect } from '../rendering/HalftoneRenderer';
export function initSceneFin(): any {
    if (!runtime.globalSceneManager)
        return;
    runtime.globalSceneManager.init("[data-fin-scene]", (e?: any): any => initCanvasEffect(e, [
        {
            type: "image",
            src: "/assets/69ca6aa1e460a649ef2a7972_fin_mounain.avif",
            config: {
                x: "0%",
                y: "0%",
                width: "80%",
                height: "100%",
                blackPoint: 200,
                whitePoint: 75,
                threshold: 255,
                bgOpacity: 1,
                fillOpacity: 1,
            },
        },
    ]));
}
