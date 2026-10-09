/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, ScrollTrigger } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';

export function initIndexCounter(): any {
    const e: any = document.querySelectorAll("[index-w]");
    e.length &&
        e.forEach((e?: any): any => {
            const t: any = Array.from(e.children);
            let o: any = 0;
            t.forEach((e?: any): any => {
                const t: any = e.querySelector('[index="text"]');
                if (!t)
                    return;
                o++;
                const n: any = String(o).padStart(2, "0");
                t.textContent = n;
            });
        });
}
export function initNextEntityCard(): any {
    document.querySelectorAll('[next-nav="w"]').forEach((e?: any): any => {
        const t: any = Array.from(e.querySelectorAll("[next-nav]")), o: any = window.location.pathname.split("/").filter(Boolean).pop(), n: any = (t.findIndex((e?: any): any => e.getAttribute("next-nav") === o) + 1) % t.length;
        t.length <= 1
            ? (e.style.display = "none")
            : (t.forEach((e?: any): any => (e.style.display = "none")),
                t[n] && ((t[n].style.display = "block"), ScrollTrigger.refresh()));
    });
}
export function initOther(): any {
    const e: any = document.querySelectorAll(".year");
    if (e.length) {
        const t: any = new Date().getFullYear();
        e.forEach((e?: any): any => {
            e.textContent = t;
        });
    }
    const t: any = document.querySelectorAll("[first-tag]");
    t.length &&
        t.forEach((e?: any): any => {
            const t: any = e.getAttribute("first-tag");
            if (!t)
                return;
            const o: any = document.querySelector(`[tag-list="${t}"]`);
            o && o.insertBefore(e, o.firstChild);
        });
    const o: any = document.querySelectorAll("[data-last-updated]");
    o.length &&
        o.forEach((e?: any): any => {
            const t: any = e.querySelector("[data-source]"), o: any = e.querySelector("[data-target]");
            t && o && (o.textContent = t.textContent);
        });
    const n: any = document.querySelector("[data-btn-back]");
    n && listen(n, "click", (): any => history.back());
    const i: any = document.querySelector('[data-scroll-trigger="refresh"]');
    if (i) {
        manageObserver(new IntersectionObserver(([e]: any): any => {
            e.isIntersecting && ScrollTrigger.refresh();
        })).observe(i);
    }
    const r: any = document.querySelectorAll('[data-view-all="w"]');
    r.length &&
        r.forEach((e?: any): any => {
            const t: any = e.querySelectorAll('[data-view-all="item"]'), o: any = e.querySelectorAll('[data-view-all="btn"]');
            o.length && t.length <= 1 && gsap.set(o, { display: "none" });
        });
    const a: any = document.querySelector(".news-slider-cms_list");
    if (a) {
        const e: any = document.querySelector('[floating-tip="drag"]'), t: any = a.querySelectorAll(".news-slider-cms_list_item");
        e && (e.style.visibility = t.length <= 2 ? "hidden" : "visible");
    }
}
