/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';
import { initCanvasEffect } from '../rendering/HalftoneRenderer';
export function initSceneHeroOver(): any {
    if (!runtime.globalSceneManager)
        return;
    const e: any = runtime.globalSceneManager, t: any = window.innerWidth >= runtime.breakPoint, o: any = t ? 33.33 : 66.66;
    e.init("[data-intro-over-scene]", (e?: any): any => {
        const n: any = [
            {
                type: "image",
                src: "/assets/697bfe61104a60fa63e1f7b2_19804f2b1c9ceedd0cd04ed721b36ef6_intro_mauntain.avif",
                config: {
                    x: "0%",
                    y: "40%",
                    width: "100%",
                    height: "60%",
                    blackPoint: 25,
                    whitePoint: 200,
                    threshold: 255,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
            {
                type: "image",
                src: "/assets/697e2b5ea694ae5f751655ec_95efa55632b52e963bc2cbf7f0447122_hero_hay.avif",
                config: {
                    x: "56%",
                    y: "66%",
                    width: "14%",
                    height: "12%",
                    blackPoint: 25,
                    whitePoint: 200,
                    threshold: 255,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                skip: !t,
                sources: [
                    {
                        src: "/assets/scenes/hero_tree-c.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: "70%",
                    y: "42%",
                    width: "43.5%",
                    height: "52%",
                    blackPoint: 55,
                    whitePoint: 175,
                    threshold: 255,
                    ySquares: 100,
                    xSquares: 150,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                sources: [
                    {
                        src: "/assets/scenes/hero_sheeps-c.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: "0%",
                    y: "72%",
                    width: "72%",
                    height: "32%",
                    blackPoint: 15,
                    whitePoint: 255,
                    threshold: 255,
                    ySquares: 150,
                    xSquares: 200,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                skip: !t,
                sources: [
                    {
                        src: "/assets/scenes/claudes_02.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: "5%",
                    y: "25%",
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
                        src: "/assets/scenes/birds_04.hevc.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: -1 * o + "%",
                    y: "30%",
                    width: `${o}%`,
                    height: `${o}vw`,
                    blackPoint: 255,
                    whitePoint: 0,
                    threshold: 255,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
        ], i: any = initCanvasEffect(e, n.filter((e?: any): any => !e.skip)), r: any = gsap
            .timeline({
            scrollTrigger: {
                trigger: e,
                start: "50% bottom",
                end: "bottom top",
                scrub: !0,
            },
        })
            .to(n[0].config, { blackPoint: 45, whitePoint: 175, ease: "none" }, 0)
            .to(n[1].config, { blackPoint: 75, whitePoint: 150, ease: "none" }, 0), a: any = t
            ? gsap
                .timeline({
                scrollTrigger: {
                    trigger: e,
                    start: "top bottom",
                    end: "bottom 50%",
                    scrub: !0,
                },
            })
                .to(n[4].config, { x: "-30%", ease: "none" }, 0)
            : null, s: any = gsap
            .timeline({ paused: !0 })
            .to(n[5].config, {
            x: "100%",
            duration: 5,
            ease: "none",
            delay: 5,
            repeat: -1,
            repeatDelay: 5,
        }, 0), c: any = manageObserver(new IntersectionObserver((e?: any): any => {
            e.forEach((e?: any): any => {
                e.isIntersecting ? s.paused() && s.play() : s.paused() || s.pause();
            });
        }, { threshold: 0.01, rootMargin: "20% 0px 20% 0px" }));
        return (c.observe(e),
            {
                destroy: (): any => {
                    (r.scrollTrigger?.kill(),
                        r.kill(),
                        a?.scrollTrigger?.kill(),
                        a?.kill(),
                        s.kill(),
                        c.disconnect(),
                        i?.destroy());
                },
                loaded: i?.loaded,
            });
    });
}
export function initSceneHeroBg(): any {
    if (window.innerWidth < runtime.breakPoint)
        return;
    if (!runtime.globalSceneManager)
        return;
    runtime.globalSceneManager.init("[data-intro-bg-scene]", (e?: any): any => {
        const t: any = [
            {
                type: "image",
                src: "/assets/697c00f3737120e569370c7a_98c738340828600251b32ef432d3de26_hero_mauntain-bg.avif",
                config: {
                    x: "0%",
                    y: "45%",
                    width: "100%",
                    height: "60%",
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
                        src: "/assets/scenes/claudes_03.mp4",
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
            {
                type: "video",
                sources: [
                    {
                        src: "/assets/scenes/birds_03.hevc.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: "-33.33%",
                    y: "0%",
                    width: "33.33%",
                    height: "33.33vw",
                    blackPoint: 255,
                    whitePoint: 0,
                    threshold: 255,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
        ], o: any = initCanvasEffect(e, t), n: any = gsap
            .timeline({
            scrollTrigger: {
                trigger: e,
                start: "top bottom",
                end: "bottom 50%",
                scrub: !0,
            },
        })
            .to(t[1].config, { x: "60%", ease: "none" }, 0), i: any = gsap
            .timeline({ paused: !0 })
            .to(t[2].config, { x: "100%", duration: 5, ease: "none", repeat: -1, repeatDelay: 5 }, 0), r: any = manageObserver(new IntersectionObserver((e?: any): any => {
            e.forEach((e?: any): any => {
                e.isIntersecting ? i.paused() && i.play() : i.paused() || i.pause();
            });
        }, { threshold: 0.01, rootMargin: "20% 0px 20% 0px" }));
        return (r.observe(e),
            {
                destroy: (): any => {
                    (n.scrollTrigger?.kill(),
                        n.kill(),
                        i.kill(),
                        r.disconnect(),
                        o?.destroy());
                },
                loaded: o?.loaded,
            });
    });
}
