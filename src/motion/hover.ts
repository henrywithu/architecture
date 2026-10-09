/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, ScrollTrigger, SplitText } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';

export function initMagneticEffect(): any {
    ScrollTrigger.matchMedia({
        [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
            const e: any = document.querySelectorAll("[data-magnetic-strength]");
            if (window.innerWidth <= 991)
                return;
            const t: any = (e?: any, t?: any): any => {
                e &&
                    (gsap.killTweensOf(e),
                        (t ? gsap.set : gsap.to)(e, {
                            x: "0em",
                            y: "0em",
                            rotate: "0deg",
                            clearProps: "all",
                            ...(!t && { ease: "elastic.out(1, 0.3)", duration: 1.6 }),
                        }));
            }, o: any = (e?: any): any => {
                const o: any = e.currentTarget;
                (t(o, !0),
                    o
                        .querySelectorAll("[data-magnetic-inner-target]")
                        .forEach((e?: any): any => t(e, !0)));
            }, n: any = (e?: any): any => {
                const t: any = e.currentTarget, o: any = t.getBoundingClientRect(), n: any = parseFloat(t.getAttribute("data-magnetic-strength")) || 25, i: any = t.querySelectorAll("[data-magnetic-inner-target]"), r: any = parseFloat(t.getAttribute("data-magnetic-strength-inner")) || n, a: any = ((e.clientX - o.left) / t.offsetWidth - 0.5) * (n / 16), s: any = ((e.clientY - o.top) / t.offsetHeight - 0.5) * (n / 16);
                (gsap.to(t, {
                    x: a + "em",
                    y: s + "em",
                    rotate: "0.001deg",
                    ease: "power4.out",
                    duration: 1.6,
                }),
                    i.length &&
                        i.forEach((n?: any): any => {
                            const i: any = ((e.clientX - o.left) / t.offsetWidth - 0.5) * (r / 16), a: any = ((e.clientY - o.top) / t.offsetHeight - 0.5) * (r / 16);
                            gsap.to(n, {
                                x: i + "em",
                                y: a + "em",
                                rotate: "0.001deg",
                                ease: "power4.out",
                                duration: 2,
                            });
                        }));
            }, i: any = (e?: any): any => {
                const t: any = e.currentTarget, o: any = t.querySelectorAll("[data-magnetic-inner-target]");
                (gsap.to(t, {
                    x: "0em",
                    y: "0em",
                    ease: "elastic.out(1, 0.3)",
                    duration: 1.6,
                    clearProps: "all",
                }),
                    o.length &&
                        o.forEach((e?: any): any => {
                            gsap.to(e, {
                                x: "0em",
                                y: "0em",
                                ease: "elastic.out(1, 0.3)",
                                duration: 2,
                                clearProps: "all",
                            });
                        }));
            };
            e.forEach((e?: any): any => {
                (listen(e, "mouseenter", o), listen(e, "mousemove", n), listen(e, "mouseleave", i));
            });
        },
    });
}
export function initMapPins(): any {
    ScrollTrigger.matchMedia({
        [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
            function e(e?: any, t?: any, o?: any, n?: any): any {
                return Math.sqrt(Math.pow(o - e, 2) + Math.pow(n - t, 2));
            }
            function t(t?: any): any {
                const o: any = t.clientX, n: any = t.clientY;
                i.forEach((t?: any): any => {
                    const i: any = t.getBoundingClientRect(), s: any = i.left + i.width / 2, c: any = i.top + i.height / 2, l: any = e(o, n, s, c), d: any = l < a ? r - (l / a) * (r - 1) : 1;
                    gsap.to(t, { scale: d, duration: runtime.durL, ease: "Out" });
                });
            }
            function o(): any {
                i.forEach((e?: any): any => {
                    gsap.to(e, { scale: 1, duration: runtime.durL, ease: "Out" });
                });
            }
            const n: any = document.querySelector("[map]"), i: any = n?.querySelectorAll("[pin]");
            if (!n || 0 === i.length)
                return;
            const r: any = 1.5, a: any = 240;
            (listen(n, "mousemove", t), listen(n, "mouseleave", o));
        },
    });
}
export function initNavItemHover(): any {
    ScrollTrigger.matchMedia({
        [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
            document.querySelectorAll("[hover-nav-item]").forEach((e?: any): any => {
                function t(): any {
                    (gsap.fromTo(i.chars, { opacity: 1, yPercent: 0, scale: 1 }, {
                        opacity: 0,
                        yPercent: -75,
                        scale: 0,
                        duration: runtime.durM,
                        ease: "Out",
                        stagger: { each: 0.25 * runtime.stagger, from: "random" },
                        overwrite: !0,
                    }),
                        gsap.fromTo(r.chars, { opacity: 0, yPercent: 75, scale: 0 }, {
                            opacity: 1,
                            yPercent: 0,
                            scale: 1,
                            duration: runtime.durM,
                            delay: runtime.delayReveal,
                            ease: "Out",
                            stagger: { each: 0.25 * runtime.stagger, from: "random" },
                            overwrite: !0,
                        }));
                }
                function o(): any {
                    (gsap.to(i.chars, {
                        opacity: 1,
                        yPercent: 0,
                        scale: 1,
                        duration: runtime.durM,
                        delay: runtime.delayReveal,
                        ease: "Out",
                        stagger: { each: 0.25 * runtime.stagger, from: "random" },
                        overwrite: !0,
                    }),
                        gsap.to(r.chars, {
                            opacity: 0,
                            yPercent: 75,
                            scale: 0,
                            duration: runtime.durM,
                            ease: "Out",
                            stagger: { each: 0.25 * runtime.stagger, from: "random" },
                            overwrite: !0,
                        }));
                }
                const n: any = e.querySelectorAll("[hover='text']");
                if (n.length < 2)
                    return;
                const i: any = new SplitText(n[0], {
                    type: "chars",
                    tag: "span",
                    charsClass: "split-char",
                    smartWrap: !0,
                }), r: any = new SplitText(n[1], {
                    type: "chars",
                    tag: "span",
                    charsClass: "split-char",
                    smartWrap: !0,
                });
                gsap.set(r.chars, { yPercent: 75, opacity: 0, scale: 0 });
                const a: any = e.closest("[hover-nav-item-trigger]") || e;
                (listen(a, "mouseenter", t), listen(a, "mouseleave", o));
            });
        },
    });
}
export function initMenuItemHover(): any {
    ScrollTrigger.matchMedia({
        [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
            const e: any = document.querySelectorAll("[hover-menu-item]");
            e.forEach((t?: any): any => {
                (listen(t, "mouseenter", (): any => {
                    e.forEach((e?: any): any => {
                        e !== t &&
                            (gsap.to(e, {
                                opacity: 0.2,
                                duration: runtime.durM,
                                ease: "Out",
                                overwrite: !0,
                            }),
                                gsap.to(t, {
                                    opacity: 1,
                                    duration: 0.25 * runtime.durS,
                                    ease: "Out",
                                    overwrite: !0,
                                }));
                    });
                }), listen(t, "mouseleave", (): any => {
                    e.forEach((e?: any): any => {
                        gsap.to(e, {
                            opacity: 1,
                            duration: runtime.durS,
                            ease: "Out",
                            overwrite: !0,
                        });
                    });
                }));
            });
        },
    });
}
export function initFloatingTips(): any {
    ScrollTrigger.matchMedia({
        [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
            function e(e?: any): any {
                return (e * parseFloat(getComputedStyle(document.documentElement).fontSize));
            }
            function t(e?: any, t?: any, o?: any): any {
                (gsap.killTweensOf(e),
                    gsap.set(e, {
                        display: "flex",
                        scale: 2,
                        opacity: 1,
                        clipPath: "inset(0% 50% 0% 50% round var(--_units---u-24))",
                        x: t + a,
                        y: o + a,
                    }),
                    gsap.to(e, {
                        scale: 1,
                        clipPath: "inset(0% 0% 0% 0% round var(--_units---u-24))",
                        duration: runtime.durM,
                        ease: "Out",
                    }));
            }
            function o(e?: any): any {
                (gsap.killTweensOf(e),
                    gsap.to(e, {
                        scale: 0.5,
                        opacity: 0,
                        clipPath: "inset(0% 0% 0% 0% round var(--_units---u-24))",
                        duration: runtime.durS,
                        ease: "In",
                        onComplete: (): any => {
                            e.style.display = "none";
                        },
                    }));
            }
            function n(e?: any): any {
                r.forEach((t?: any): any => {
                    gsap.to(t, {
                        x: e.clientX + a,
                        y: e.clientY + a,
                        duration: runtime.durL,
                        ease: "power3",
                    });
                });
            }
            const i: any = {}, r: any = new Set();
            document.querySelectorAll("[floating-tip]").forEach((e?: any): any => {
                const t: any = e.getAttribute("floating-tip");
                i[t] = e;
            });
            const a: any = e(1.388);
            (listen(document, "mousemove", n),
                document.querySelectorAll("[floating-tip-btn]").forEach((e?: any): any => {
                    const n: any = e.getAttribute("floating-tip-btn"), a: any = i[n];
                    a &&
                        (listen(e, "mouseenter", (e?: any): any => {
                            (r.add(a), t(a, e.clientX, e.clientY));
                        }), listen(e, "mouseleave", (): any => {
                            (r.delete(a), o(a));
                        }));
                }));
        },
    });
}
