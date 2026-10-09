/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, ScrollTrigger } from "../core/runtime";
import {
  listen,
  manageObserver,
  managedInterval,
  managedTimeout,
  matchMedia,
} from "../core/Lifecycle";
import { animateTextH, animateCtn } from "../motion/text";
export function initTabs(): any {
  const e: any = document.querySelectorAll("[data-tabs]");
  e.length &&
    e.forEach((e?: any): any => {
      const t: any = e.querySelectorAll("[data-tab-trigger]");
      e.querySelectorAll("[data-tab-content]");
      let o: any = t[0]?.getAttribute("data-tab-trigger"),
        n: any = !1;
      (t[0] && t[0].classList.add("is-active"),
        t.forEach((t?: any): any => {
          listen(t, "click", (): any => {
            const i: any = t.getAttribute("data-tab-trigger");
            if (i === o) return;
            const r: any = e.querySelector(`[data-tab-trigger="${o}"]`),
              a: any = e.querySelector(`[data-tab-content="${o}"]`),
              s: any = e.querySelector(`[data-tab-content="${i}"]`);
            (gsap.killTweensOf([a, s]),
              (n = !0),
              gsap.set(a, {
                display: "block",
                position: "absolute",
                transformOrigin: "top bottom",
              }),
              gsap.set(s, {
                display: "block",
                position: "relative",
                transformOrigin: "top bottom",
                xPercent: 125,
                rotate: -15,
              }),
              ScrollTrigger.refresh(),
              gsap.to(a, {
                xPercent: -125,
                rotate: 15,
                duration: runtime.durL,
                ease: "InOut",
                onComplete: (): any => {
                  n && (a.style.display = "none");
                },
              }),
              gsap.to(s, {
                xPercent: 0,
                rotate: 0,
                duration: runtime.durL,
                ease: "InOut",
                onComplete: (): any => {
                  n = !1;
                },
              }),
              r.classList.remove("is-active"),
              t.classList.add("is-active"),
              (o = i));
          });
        }));
    });
}
export function initTabsHilight(): any {
  const e: any = document.querySelectorAll("[data-tabs-hilight]");
  e.length &&
    e.forEach((e?: any): any => {
      function t(): any {
        const t: any = e.querySelector("[data-tab].is-active");
        t &&
          gsap
            .timeline()
            .to(n, {
              x: t.offsetLeft,
              width: t.offsetWidth,
              duration: runtime.durM,
              ease: "InOut",
            })
            .add((): any => {
              (o.forEach((e?: any): any =>
                e.classList.remove("theme_on-light"),
              ),
                t.classList.add("theme_on-light"));
            }, "<50%");
      }
      const o: any = e.querySelectorAll("[data-tab]"),
        n: any = e.querySelector("[data-tab-hilight]");
      o.length &&
        n &&
        (t(),
        o.forEach((e?: any): any => {
          listen(e, "click", (): any => {
            (o.forEach((e?: any): any => e.classList.remove("is-active")),
              e.classList.add("is-active"),
              t());
          });
        }));
    });
}
export function initTabsText(): any {
  const e: any = document.querySelectorAll("[data-tabs-text]");
  e.length &&
    e.forEach((e?: any): any => {
      const t: any = e.querySelectorAll("[data-tab-trigger]");
      e.querySelectorAll("[data-tab-content]");
      let o: any = t[0]?.getAttribute("data-tab-trigger"),
        n: any = !1;
      (t[0] && t[0].classList.add("is-active"),
        t.forEach((t?: any): any => {
          listen(t, "click", (): any => {
            const i: any = t.getAttribute("data-tab-trigger");
            if (i === o) return;
            const r: any = e.querySelector(`[data-tab-trigger="${o}"]`),
              a: any = e.querySelector(`[data-tab-content="${o}"]`),
              s: any = a.querySelectorAll('[data-content="h"]'),
              c: any = a.querySelectorAll('[data-content="ctn"]'),
              l: any = e.querySelector(`[data-tab-content="${i}"]`),
              d: any = l.querySelectorAll('[data-content="h"]'),
              u: any = l.querySelectorAll('[data-content="ctn"]');
            (gsap.killTweensOf([a, l]),
              (n = !0),
              gsap
                .timeline({
                  onComplete: (): any => {
                    ((n = !1), ScrollTrigger.refresh());
                  },
                })
                .call((): any => {
                  (animateTextH(s, "hide", 0), animateCtn(c, "hide", 0));
                })
                .set(a, {
                  display: "none",
                  position: "absolute",
                  delay: runtime.durM,
                })
                .set(l, { display: "block", position: "relative" })
                .call((): any => {
                  (animateTextH(d, "reveal", 0), animateCtn(u, "reveal", 0));
                }),
              r.classList.remove("is-active"),
              t.classList.add("is-active"),
              (o = i));
          });
        }));
    });
}
export function initSummerWinterSwitcher(): any {
  function e(e?: any): any {
    const t: any = l.getPointAtLength(e * v);
    return { x: t.x, y: t.y };
  }
  function t(e?: any): any {
    let t: any = null;
    (e < 0.4 ? (t = "summer") : e > 0.5 && (t = "winter"),
      t !== f &&
        ("summer" === t && g ? g.click() : "winter" === t && p && p.click(),
        (f = t)));
  }
  function o(e?: any): any {
    gsap.to(
      { progress: y },
      {
        progress: e,
        duration: runtime.durM,
        ease: "Ease",
        onUpdate: function (this: any): any {
          ((y = this.targets()[0].progress), a(y), t(y));
        },
      },
    );
  }
  function n(): any {
    ((h = !0), (c.style.cursor = "grabbing"));
  }
  function i(o?: any): any {
    if (!h) return;
    const n: any = o.clientX || o.touches?.[0]?.clientX,
      i: any = o.clientY || o.touches?.[0]?.clientY,
      r: any = s.getBoundingClientRect(),
      c: any = n - r.left,
      l: any = i - r.top;
    let d: any = 0,
      u: any = 1 / 0;
    for (let t: any = 0; t <= 100; t++) {
      const o: any = t / 100,
        n: any = e(o),
        i: any = Math.sqrt(Math.pow(n.x - c, 2) + Math.pow(n.y - l, 2));
      i < u && ((u = i), (d = o));
    }
    ((y = d), a(y), t(y));
  }
  function r(): any {
    if (!h) return;
    ((h = !1), (c.style.cursor = "grab"));
    o(y < 0.5 ? 0 : 1);
  }
  function a(t?: any): any {
    const o: any = e(t);
    gsap.set(c, { cx: o.x, cy: o.y });
  }
  const s: any = document.querySelector("[data-line-animation]");
  if (!s) return;
  const c: any = s.querySelector("[data-active]"),
    l: any = s.querySelector("[data-path]"),
    d: any = s.querySelector("[data-start]"),
    u: any = s.querySelector("[data-end]"),
    g: any = document.querySelector("[data-summer-btn]"),
    p: any = document.querySelector("[data-winter-btn]"),
    m: any = l.getPointAtLength(0);
  let h: any = !1,
    y: any = 0,
    f: any = null;
  const v: any = l.getTotalLength();
  (gsap.set(c, { cx: m.x, cy: m.y }),
    listen(d, "click", (): any => {
      o(0);
    }),
    listen(u, "click", (): any => {
      o(1);
    }),
    (c.style.cursor = "grab"),
    (d.style.cursor = "pointer"),
    (u.style.cursor = "pointer"),
    listen(c, "mousedown", n),
    listen(c, "touchstart", n),
    listen(document, "mousemove", i),
    listen(document, "touchmove", i),
    listen(document, "mouseup", r),
    listen(document, "touchend", r));
}
