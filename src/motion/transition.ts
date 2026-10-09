/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';

export function animateTransition(e?: any): any {
    const t: any = document.querySelector(".transition"), o: any = t.querySelectorAll(".transition_cell"), n: any = t.querySelectorAll(".transition_over");
    switch (e) {
        case "in":
            gsap
                .timeline()
                .set(t, { display: "flex" })
                .fromTo(o, { scaleX: 0 }, {
                scaleX: 1,
                duration: runtime.durS,
                ease: "InOut",
                stagger: { each: 0.03, from: "end", grid: [20, 12] },
            })
                .fromTo(n, { opacity: 0 }, { opacity: 1, duration: runtime.durL, ease: "InOut" }, 0);
            break;
        case "out":
            gsap
                .timeline({
                onComplete: (): any => {
                    gsap.set(t, { display: "none" });
                },
            })
                .set(t, { display: "flex" })
                .fromTo(o, { scaleX: 1 }, {
                scaleX: 0,
                duration: runtime.durS,
                ease: "InOut",
                stagger: { each: 0.03, from: "end", grid: [20, 12] },
            })
                .fromTo(n, { opacity: 1 }, { opacity: 0, duration: runtime.durL, ease: "InOut" }, 0);
            break;
        case "init":
            (gsap.set(t, { display: "flex" }),
                gsap.set(o, { scaleX: 1 }),
                gsap.set(n, { opacity: 1 }));
    }
}
