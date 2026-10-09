/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, SplitText } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';

export function animateTextH(e?: any, t?: any, o?: any): any {
    const n: any = gsap.utils.toArray(e);
    n.length &&
        n.forEach((e?: any, n?: any): any => {
            e._split ||
                (e._split = new SplitText(e, {
                    type: "words",
                    tag: "span",
                    wordsClass: "split-word",
                    smartWrap: !0,
                }));
            const i: any = n * runtime.stagger * 0.5;
            switch (t) {
                case "reveal":
                    gsap.fromTo(e._split.words, {
                        yPercent: gsap.utils.wrap([-150, 75, -75, 150]),
                        scale: 0,
                        opacity: 0,
                    }, {
                        yPercent: 0,
                        scale: 1,
                        opacity: 1,
                        duration: runtime.durL,
                        delay: (o ?? runtime.delayReveal) + i,
                        stagger: { each: 0.25 * runtime.stagger, from: "random" },
                        ease: "Out",
                        overwrite: !0,
                    });
                    break;
                case "hide":
                    gsap.to(e._split.words, {
                        yPercent: gsap.utils.wrap([75, -75, 75, -75]),
                        scale: 0,
                        opacity: 0,
                        duration: runtime.durS,
                        delay: o ?? 0,
                        stagger: { each: 0.25 * runtime.stagger, from: "random" },
                        ease: "In",
                        overwrite: !0,
                    });
                    break;
                case "initial":
                    gsap.set(e._split.words, {
                        yPercent: gsap.utils.wrap([-150, 75, -75, 150]),
                        scale: 0,
                        opacity: 0,
                    });
            }
        });
}
export function animateTextP(e?: any, t?: any, o?: any): any {
    const n: any = gsap.utils.toArray(e);
    n.length &&
        n.forEach((e?: any, n?: any): any => {
            e._split ||
                ((e._split = new SplitText(e, {
                    type: "lines",
                    linesClass: "split-line",
                    aria: "none",
                })),
                    document.querySelectorAll(".split-line").forEach((e?: any): any => {
                        "" === e.textContent.trim() &&
                            e.replaceWith(document.createElement("br"));
                    }));
            const i: any = n * runtime.stagger * 0.25;
            switch (t) {
                case "reveal":
                    gsap.fromTo(e._split.lines, { yPercent: 250, opacity: 0 }, {
                        yPercent: 0,
                        opacity: 1,
                        duration: runtime.durL,
                        delay: (o ?? runtime.delayReveal) + i,
                        stagger: 0.5 * runtime.stagger,
                        ease: "Out",
                        overwrite: !0,
                    });
                    break;
                case "hide":
                    gsap.to(e._split.lines, {
                        yPercent: 0,
                        opacity: 0,
                        duration: runtime.durS,
                        delay: o ?? 0,
                        stagger: 0.5 * runtime.stagger,
                        ease: "In",
                        overwrite: !0,
                    });
                    break;
                case "initial":
                    gsap.set(e._split.lines, { yPercent: 0, opacity: 0 });
            }
        });
}
export function animateCtn(e?: any, t?: any, o?: any): any {
    const n: any = gsap.utils.toArray(e);
    if (n.length)
        switch (t) {
            case "reveal":
                gsap.fromTo(n, { opacity: 0, yPercent: 100 }, {
                    opacity: 1,
                    yPercent: 0,
                    duration: runtime.durL,
                    delay: o ?? runtime.delayReveal,
                    stagger: 0.5 * runtime.stagger,
                    ease: "Out",
                    overwrite: !0,
                });
                break;
            case "hide":
                gsap.to(n, {
                    opacity: 0,
                    yPercent: 0,
                    duration: runtime.durS,
                    delay: o ?? 0,
                    stagger: 0.5 * runtime.stagger,
                    ease: "In",
                    overwrite: !0,
                });
                break;
            case "initial":
                gsap.set(n, { opacity: 0, yPercent: 0 });
        }
}
export function animateLine(e?: any, t?: any, o?: any): any {
    const n: any = gsap.utils.toArray(e);
    if (n.length)
        switch (t) {
            case "reveal":
                gsap.fromTo(n, { clipPath: "inset(0% 100% -1px 0%)" }, {
                    clipPath: "inset(0% 0% -1px 0%)",
                    duration: runtime.durL,
                    delay: o ?? runtime.delayReveal,
                    stagger: runtime.stagger,
                    ease: "Out",
                    overwrite: !0,
                });
                break;
            case "hide":
                gsap.to(n, {
                    clipPath: "inset(0% 0% -1px 100%)",
                    duration: runtime.durS,
                    delay: o ?? 0,
                    stagger: 0.5 * runtime.stagger,
                    ease: "In",
                    overwrite: !0,
                });
                break;
            case "initial":
                gsap.set(n, { clipPath: "inset(0% 0% -1px 100%)" });
        }
}
