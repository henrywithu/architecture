/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, ScrollTrigger } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';
import { initCanvasEffect } from '../rendering/HalftoneRenderer';
export function initSceneBenefitsIntro(): any {
    if (!runtime.globalSceneManager)
        return;
    const e: any = {
        desk: { initial: 128, final: 189.44 },
        mob: { initial: 100, final: 156 },
    }, t: any = { desk: { initial: 30, final: 230 }, mob: { initial: 15, final: 215 } }, o: any = (): any => window.innerWidth >= runtime.breakPoint, n: any = (): any => (o() ? e.desk.initial : e.mob.initial), i: any = (): any => (o() ? e.desk.final : e.mob.final), r: any = (): any => (o() ? t.desk.initial : t.mob.initial), a: any = (): any => (o() ? t.desk.final : t.mob.final);
    runtime.globalSceneManager.init("[data-benefits-intro-scene]", (e?: any): any => {
        const t: any = [
            {
                type: "image",
                src: "/assets/697656035b94c920c471d4de_ac179cd8d062e41260b178efc691b568_benefits-intro_hole.avif",
                config: {
                    x: "0%",
                    y: "0%",
                    width: "100%",
                    height: `${n()}%`,
                    gamma: 1,
                    blackPoint: 10,
                    whitePoint: 225,
                    threshold: 255,
                    bgOpacity: 0,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                sources: [
                    {
                        src: "/assets/scenes/benefits-intro_persons-cc.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: `${r()}%`,
                    y: "10%",
                    width: "81%",
                    height: "116%",
                    blackPoint: 25,
                    whitePoint: 200,
                    threshold: 255,
                    ySquares: 136,
                    xSquares: 136,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                sources: [
                    {
                        src: "/assets/scenes/benefits-intro_birds-c.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: "-4%",
                    y: "40%",
                    width: "60%",
                    height: "72%",
                    blackPoint: 255,
                    whitePoint: 75,
                    threshold: 255,
                    ySquares: 136,
                    xSquares: 136,
                    bgOpacity: 1,
                    fillOpacity: 1,
                },
            },
        ], o: any = gsap
            .timeline({
            scrollTrigger: {
                trigger: e,
                start: "bottom bottom",
                end: "bottom -50%",
                scrub: !0,
                onRefresh: (e?: any): any => {
                    e.progress > 0 && o.progress(e.progress);
                },
                invalidateOnRefresh: !0,
            },
        })
            .to(t[0].config, {
            x: "-25%",
            y: "-30%",
            width: "148%",
            height: `${i()}%`,
            blackPoint: 0,
            whitePoint: 1,
            ease: "InOut",
        }, 0)
            .to(t[1].config, {
            x: `${a()}%`,
            y: "-50%",
            width: "324%",
            height: "464%",
            ease: "In",
        }, "<")
            .to(t[2].config, { x: "-204%", y: "-20%", width: "240%", height: "288%", ease: "In" }, "<"), s: any = initCanvasEffect(e, t);
        return (requestAnimationFrame((): any => {
            ScrollTrigger.refresh();
        }),
            {
                destroy: (): any => {
                    (o.scrollTrigger?.kill(), o.kill(), s?.destroy());
                },
                loaded: s?.loaded,
            });
    });
}
export function initSceneBenefitsOutro(): any {
    if (window.innerWidth < runtime.breakPoint)
        return;
    if (!runtime.globalSceneManager)
        return;
    const e: any = runtime.globalSceneManager, t: any = window.innerWidth >= runtime.breakPoint ? 33.33 : 100;
    e.init("[data-benefits-outro-scene]", (e?: any): any => {
        const o: any = [
            {
                type: "video",
                sources: [
                    {
                        src: "/assets/scenes/benefits-outro_sheeps.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: "-8%",
                    y: "55%",
                    width: "68%",
                    height: "50%",
                    blackPoint: 256,
                    whitePoint: 255,
                    threshold: 255,
                    xSquares: 150,
                    ySquares: 50,
                    bgOpacity: 0,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                sources: [
                    {
                        src: "/assets/scenes/birds_05-c.mp4",
                        type: "video/mp4",
                    },
                ],
                config: {
                    x: -1 * t + "%",
                    y: "-5%",
                    width: `${t}%`,
                    height: `${t}vw`,
                    blackPoint: 256,
                    whitePoint: 255,
                    threshold: 255,
                    bgOpacity: 0,
                    fillOpacity: 1,
                },
            },
            {
                type: "video",
                sources: [
                    {
                        src: "/assets/scenes/benefits-outro_tree-c.mp4",
                        type: "video/mp4",
                    },
                ],
                loop: !1,
                config: {
                    x: "35%",
                    y: "-25%",
                    width: "76%",
                    height: "96%",
                    blackPoint: -1,
                    whitePoint: 0,
                    threshold: 255,
                    xSquares: 150,
                    ySquares: 100,
                    bgOpacity: 0,
                    fillOpacity: 1,
                },
            },
        ], n: any = initCanvasEffect(e, o), i: any = gsap
            .timeline({
            scrollTrigger: {
                trigger: e,
                start: "top top",
                end: "bottom top",
                scrub: !0,
            },
        })
            .to(o[0].config, { blackPoint: 150, whitePoint: 0, ease: "none" }, 0)
            .to(o[1].config, { blackPoint: 200, whitePoint: 55, ease: "none" }, 0)
            .to(o[2].config, { blackPoint: 55, whitePoint: 200, ease: "none" }, 0);
        let r: any = null;
        const a: any = document.querySelector(".benefits-s_cms");
        a &&
            (r = gsap
                .timeline({
                scrollTrigger: {
                    trigger: a,
                    start: "top top",
                    end: "bottom top",
                    scrub: !0,
                },
            })
                .to(o[0].config, { x: "-18%", y: "30%", ease: "In" }, 0)
                .to(o[2].config, { x: "50%", y: "-100%", ease: "In" }, 0));
        const s: any = gsap
            .timeline({ paused: !0 })
            .to(o[1].config, { x: "100%", duration: 5, ease: "none", repeat: -1, repeatDelay: 5 }, 0), c: any = manageObserver(new IntersectionObserver((e?: any): any => {
            e.forEach((e?: any): any => {
                e.isIntersecting ? s.paused() && s.play() : s.paused() || s.pause();
            });
        }, { threshold: 0.01, rootMargin: "20% 0px 20% 0px" }));
        return (c.observe(e),
            requestAnimationFrame((): any => {
                ScrollTrigger.refresh();
            }),
            {
                destroy: (): any => {
                    (i.scrollTrigger?.kill(),
                        i.kill(),
                        r && (r.scrollTrigger?.kill(), r.kill()),
                        s.kill(),
                        c.disconnect(),
                        n?.destroy());
                },
                loaded: n?.loaded,
            });
    });
}
