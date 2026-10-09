/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';
import { initCanvasEffect } from '../rendering/HalftoneRenderer';
export function initSceneArticleDark(): any {
    if (!runtime.globalSceneManager)
        return;
    const e: any = runtime.globalSceneManager, t: any = window.innerWidth >= runtime.breakPoint ? 33.33 : 100;
    e.init("[data-article-dark-scene]", (e?: any): any => {
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
        ], n: any = initCanvasEffect(e, o), i: any = gsap
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
            .to({}, { duration: 10 }), r: any = manageObserver(new IntersectionObserver((e?: any): any => {
            e.forEach((e?: any): any => {
                e.isIntersecting ? i.paused() && i.play() : i.paused() || i.pause();
            });
        }, { threshold: 0.01, rootMargin: "20% 0px 20% 0px" }));
        return (r.observe(e),
            {
                destroy: (): any => {
                    (i.kill(), r.disconnect(), n?.destroy());
                },
                loaded: n?.loaded,
            });
    });
}
export function initSceneArticleLight(): any {
    if (!runtime.globalSceneManager)
        return;
    const e: any = runtime.globalSceneManager, t: any = window.innerWidth >= runtime.breakPoint ? 33.33 : 100;
    e.init("[data-article-light-scene]", (e?: any): any => {
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
                        src: "/assets/scenes/birds_02-c.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: -1 * t + "%",
                    y: "55%",
                    width: `${t}%`,
                    height: `${t}vw`,
                    blackPoint: 255,
                    whitePoint: 0,
                    threshold: 255,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
        ], n: any = initCanvasEffect(e, o), i: any = gsap
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
            .to({}, { duration: 10 }), r: any = manageObserver(new IntersectionObserver((e?: any): any => {
            e.forEach((e?: any): any => {
                e.isIntersecting ? i.paused() && i.play() : i.paused() || i.pause();
            });
        }, { threshold: 0.01, rootMargin: "20% 0px 20% 0px" }));
        return (r.observe(e),
            {
                destroy: (): any => {
                    (i.kill(), r.disconnect(), n?.destroy());
                },
                loaded: n?.loaded,
            });
    });
}
export function initSceneError(): any {
    if (!runtime.globalSceneManager)
        return;
    const e: any = runtime.globalSceneManager, t: any = window.innerWidth >= runtime.breakPoint, o: any = t ? 33.33 : 100;
    e.init("[data-error-scene]", (e?: any): any => {
        const n: any = [
            {
                type: "image",
                src: "/assets/697eaab2cfc366a5bf4bd727_f73b5dcc1687f5e65745b9063965659a_error_bg.avif",
                config: {
                    x: "-8.5%",
                    y: "-22.5%",
                    width: "120%",
                    height: "125%",
                    blackPoint: 75,
                    whitePoint: 150,
                    threshold: 255,
                    bgOpacity: 0,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                skip: !t,
                sources: [
                    {
                        src: "/assets/scenes/birds_03.hevc.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: -1 * o + "%",
                    y: "0%",
                    width: `${o}%`,
                    height: `${o}vw`,
                    blackPoint: 0,
                    whitePoint: 255,
                    threshold: 255,
                    bgOpacity: 1,
                    fillOpacity: 0,
                },
            },
            {
                type: "video",
                skip: !t,
                sources: [
                    {
                        src: "/assets/scenes/birds_02-c.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: -1 * o + "%",
                    y: "25%",
                    width: `${o}%`,
                    height: `${o}vw`,
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
                        src: "/assets/scenes/factoids_sheeps-c.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: "-5%",
                    y: "40%",
                    width: "100%",
                    height: "75%",
                    blackPoint: 225,
                    whitePoint: 25,
                    threshold: 255,
                    xSquares: 150,
                    ySquares: 100,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
        ], i: any = initCanvasEffect(e, n.filter((e?: any): any => !e.skip)), r: any = gsap
            .timeline({ paused: !0 })
            .to(n[0].config, {
            blackPoint: 55,
            whitePoint: 150,
            duration: 4,
            ease: "InOut",
            repeat: -1,
            yoyo: !0,
        }, 0);
        t &&
            r
                .to(n[1].config, { x: "100%", duration: 5, ease: "none", repeat: -1, repeatDelay: 5 }, 0)
                .to(n[2].config, {
                x: "100%",
                duration: 5,
                ease: "none",
                delay: 5,
                repeat: -1,
                repeatDelay: 5,
            }, 0);
        const a: any = manageObserver(new IntersectionObserver((e?: any): any => {
            e.forEach((e?: any): any => {
                e.isIntersecting ? r.paused() && r.play() : r.paused() || r.pause();
            });
        }, { threshold: 0.01, rootMargin: "20% 0px 20% 0px" }));
        return (a.observe(e),
            {
                destroy: (): any => {
                    (r.kill(), a.disconnect(), i?.destroy());
                },
                loaded: i?.loaded,
            });
    });
}
