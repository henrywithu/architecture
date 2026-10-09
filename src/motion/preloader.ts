/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, Flip } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';
import { initLenis, lockScroll, unlockScroll } from '../core/scroll';
import { animateTransition } from '../motion/transition';
import { animateTextH, animateTextP, animateCtn } from '../motion/text';
import { initAllScenes } from '../core/scenes';
import { initPageTransitions } from '../core/router';
export function initPreloader(): any {
    let e: any = !1;
    try {
        e = sessionStorage.getItem("hasVisited");
    }
    catch (e: any) { }
    (initLenis(), e ? animatePreloaederShort() : animatePreloaederIntro());
    try {
        sessionStorage.setItem("hasVisited", "true");
    }
    catch (e: any) { }
}
export function animatePreloaederIntro(): any {
    function e(): any {
        d
            ? (l.classList.add("d-none"),
                d.appendChild(c),
                animateTextH(p, "initial"),
                animateTextP(m, "initial"),
                animateCtn(h, "initial"),
                gsap
                    .timeline()
                    .fromTo(g, { scale: 1.5 }, { scale: 1, duration: 2 * runtime.durL, ease: "Out" })
                    .add(Flip.from(u, { duration: 1.5 * runtime.durL, ease: "InOut" }), 0)
                    .add((): any => {
                    (c.classList.remove("theme_on-dark"),
                        c.classList.add("theme_on-light"),
                        animateTextH(p, "reveal"),
                        animateTextP(m, "reveal"),
                        animateCtn(h, "reveal"));
                }, runtime.durL)
                    .add((): any => {
                    (gsap.set(t, { display: "none" }),
                        o.classList.remove("theme_on-dark"),
                        initPageTransitions(),
                        unlockScroll());
                }))
            : gsap
                .timeline()
                .to(c, { yPercent: 120, duration: runtime.durL, ease: "Out" })
                .add((): any => {
                (gsap.set(t, { display: "none" }),
                    o.classList.remove("theme_on-dark"),
                    initPageTransitions(),
                    unlockScroll());
            }, runtime.durS);
    }
    const t: any = document.querySelector("[data-preloader]"), o: any = document.querySelector(".transition"), n: any = t.querySelectorAll('[data-preloader="p"]'), i: any = t.querySelectorAll('[data-preloader="ctn"]'), r: any = t.querySelector('[data-preloader="scene"]'), a: any = t.querySelector('[data-preloader="bg"]'), s: any = t.querySelector("[data-preloader-percent]"), c: any = t.querySelector('[data-preloader="logo"]'), l: any = document.querySelector('[preloader="logo-static"]'), d: any = document.querySelector('[preloader="logo-w-finish"]'), u: any = Flip.getState(c), g: any = document.querySelector('[data-intro="video"]'), p: any = document.querySelectorAll('[data-intro="h"]'), m: any = document.querySelectorAll('[data-intro="p"]'), h: any = document.querySelectorAll('[data-intro="ctn"]'), y: any = gsap
        .timeline()
        .add((): any => {
        (lockScroll(),
            o.classList.add("theme_on-dark"),
            animateTransition("init"),
            animateTextP(n, "reveal"),
            animateCtn(i, "reveal"));
    })
        .fromTo(r, { opacity: 0 }, { opacity: 1, duration: runtime.durL, delay: runtime.delayReveal, ease: "Out" })
        .fromTo(c, { opacity: 0, yPercent: 25 }, {
        opacity: 1,
        yPercent: 0,
        duration: runtime.durL,
        delay: runtime.delayReveal,
        ease: "Out",
    }, "<")
        .to({}, { duration: runtime.durL })
        .add((): any => {
        (initAllScenes(),
            s && (s.textContent = "0%"),
            runtime.globalSceneManager!.progress((e?: any, t?: any): any => {
                s && (s.textContent = Math.round((e / t) * 100) + "%");
            }),
            Promise.all([
                runtime.framesPromise,
                runtime.globalSceneManager!.ready(),
                document.fonts.ready,
            ]).then((): any => {
                (s && (s.textContent = "100%"), y.resume());
            }),
            y.pause());
    })
        .add((): any => {
        (animateTextP(n, "hide"), animateCtn(i, "hide"));
    })
        .to(a, { opacity: 0, duration: runtime.durM, ease: "Out" })
        .add((): any => {
        animateTransition("out");
    })
        .to({}, { duration: runtime.durS })
        .add((): any => {
        e();
    });
    document.querySelector("[data-master-preloader]")?.remove();
}
export function animatePreloaederShort(): any {
    const e: any = document.querySelector("[data-preloader]"), t: any = document.querySelector(".transition");
    (gsap.set(e, { display: "none" }),
        t.classList.add("theme_on-dark"),
        initAllScenes(),
        Promise.all([
            runtime.framesPromise,
            runtime.globalSceneManager!.ready(),
            document.fonts.ready,
        ]).then((): any => {
            (animateTransition("out"),
                initPageTransitions(),
                setTimeout((): any => {
                    t.classList.remove("theme_on-dark");
                }, 1e3 * runtime.durL),
                document.querySelector("[data-master-preloader]")?.remove());
        }));
}
